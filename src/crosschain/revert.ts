import { Filter, TransactionRequest } from '@ethersproject/providers'
import { MaxUint256 } from '@ethersproject/constants'
import { AddressZero } from '@ethersproject/constants/lib/addresses'
import { ContractTransaction, Signer } from 'ethers'
import { TokenAmount } from '../entities'
import { Error, ErrorCode } from './error'
import { PendingRequest } from './pending'
import type { Symbiosis } from './symbiosis'
import { calculateGasMargin, getExternalId, getInternalId, getLogWithTimeout } from './utils'
import { MANAGER_CHAIN } from './constants'
import { NerveTrade } from './nerveTrade'
import { MulticallRouter } from './contracts'
import { ChainId } from '../constants'
import { JSBI, WaitForComplete } from '../index'

export class RevertPending {
    protected multicallRouter: MulticallRouter

    private deadline!: number
    private slippage!: number

    constructor(private symbiosis: Symbiosis, private request: PendingRequest) {
        this.multicallRouter = this.symbiosis.multicallRouter(MANAGER_CHAIN)
    }

    async revert(slippage: number, deadline: number) {
        this.slippage = slippage
        this.deadline = deadline

        const fee = await this.getFee()

        const feeV2 = this.request.type === 'v2' ? await this.getFeeV2() : undefined

        const transactionRequest = await this.getTransactionRequest(fee, feeV2)

        return {
            fee,
            transactionRequest,
            execute: (signer: Signer) => this.execute(transactionRequest, signer),
        }
    }

    private async waitForCompleteV2() {
        const { chainIdFrom, internalId, chainIdTo, revertableAddress } = this.request

        const externalId = getExternalId({
            internalId,
            chainId: chainIdTo,
            revertableAddress,
            contractAddress: this.symbiosis.portal(chainIdTo).address,
        })
        const managerSynthesis = this.symbiosis.synthesis(MANAGER_CHAIN)

        const revertBurnLog = await getLogWithTimeout({
            chainId: MANAGER_CHAIN,
            filter: managerSynthesis.filters.RevertBurnCompleted(externalId),
            symbiosis: this.symbiosis,
        })

        const receipt = await managerSynthesis.provider.getTransactionReceipt(revertBurnLog.transactionHash)

        const wfc = new WaitForComplete({
            direction: 'burn',
            symbiosis: this.symbiosis,
            revertableAddress: revertableAddress,
            chainIdIn: MANAGER_CHAIN,
            chainIdOut: chainIdFrom,
        })
        const log = await wfc.waitForComplete(receipt)

        return log.transactionHash
    }

    // Wait for the revert transaction to be mined on the original chain
    async waitForComplete() {
        const { type } = this.request
        if (type === 'v2') {
            return this.waitForCompleteV2()
        }

        const { chainIdFrom } = this.request
        const externalId = this.getExternalId()

        let filter: Filter
        if (type === 'synthesize') {
            const otherPortal = this.symbiosis.portal(chainIdFrom)
            filter = otherPortal.filters.RevertSynthesizeCompleted(externalId)
        } else {
            const otherSynthesis = this.symbiosis.synthesis(chainIdFrom)
            filter = otherSynthesis.filters.RevertBurnCompleted(externalId)
        }

        const log = await getLogWithTimeout({ chainId: chainIdFrom, filter, symbiosis: this.symbiosis })

        return log.transactionHash
    }

    protected async getFeeV2(): Promise<TokenAmount> {
        const feeToken = this.symbiosis.transitStable(this.request.chainIdFrom)
        const [receiveSide, calldata] = await this.feeBurnCallDataV2()

        const fee = await this.symbiosis.getBridgeFee({
            receiveSide,
            calldata,
            chainIdFrom: MANAGER_CHAIN,
            chainIdTo: this.request.chainIdFrom,
        })
        return new TokenAmount(feeToken, fee.toString())
    }
    protected async feeBurnCallDataV2(): Promise<[string, string]> {
        const chainIdIn = MANAGER_CHAIN
        const chainIdOut = this.request.chainIdFrom
        const { revertableAddress, fromTokenAmount } = this.request

        const synthesis = this.symbiosis.synthesis(chainIdIn)
        const portal = this.symbiosis.portal(chainIdOut)

        const internalId = getInternalId({
            contractAddress: synthesis.address,
            requestCount: MaxUint256,
            chainId: chainIdIn,
        })

        const externalId = getExternalId({
            internalId,
            contractAddress: portal.address,
            revertableAddress: revertableAddress,
            chainId: chainIdOut,
        })

        const calldata = portal.interface.encodeFunctionData('metaUnsynthesize', [
            '0', // _stableBridgingFee
            externalId, // _externalID,
            revertableAddress, // _to
            fromTokenAmount.raw.toString(), // _amount
            this.symbiosis.transitStable(chainIdOut).address, // _rToken
            AddressZero, // _finalReceiveSide
            [], // _finalCalldata
            0, // _finalOffset
        ])
        return [portal.address, calldata]
    }

    private buildMetaBurnCalldata(feeV2?: TokenAmount) {
        const chainId = this.request.chainIdFrom
        const { to } = this.request
        const synthesis = this.symbiosis.synthesis(MANAGER_CHAIN)
        const sToken = this.symbiosis.findSyntheticStable(MANAGER_CHAIN, chainId)?.address
        if (!sToken) {
            throw new Error(`Cannot find synthetic token between manager chain and ${chainId}`)
        }

        const metarouter = this.symbiosis.metaRouter(MANAGER_CHAIN)

        const calldata = synthesis.interface.encodeFunctionData('metaBurnSyntheticToken', [
            {
                stableBridgingFee: feeV2 ? feeV2.raw.toString() : '0', // uint256 stableBridgingFee;
                amount: '0', // uint256 amount;
                syntCaller: metarouter.address, // address syntCaller;
                finalReceiveSide: AddressZero, // address finalReceiveSide;
                sToken,
                finalCallData: [], // bytes finalCallData;
                finalOffset: 0, // uint256 finalOffset;
                chain2address: to, // address chain2address;
                receiveSide: this.symbiosis.portal(chainId).address,
                oppositeBridge: this.symbiosis.bridge(chainId).address,
                revertableAddress: to,
                chainID: chainId,
                clientID: this.symbiosis.clientId,
            },
        ])
        return [sToken, calldata]
    }

    private async getFee(): Promise<TokenAmount> {
        const { type, chainIdTo, chainIdFrom } = this.request

        const chainFrom: ChainId = chainIdTo
        const externalId = this.getExternalId()

        let receiveSide: string
        let calldata: string
        let chainTo: ChainId

        if (type === 'synthesize') {
            chainTo = chainIdFrom
            const portal = this.symbiosis.portal(chainTo)
            calldata = portal.interface.encodeFunctionData('revertSynthesize', ['0', externalId])
            receiveSide = portal.address
        } else if (type === 'burn') {
            chainTo = chainIdFrom
            const synthesis = this.symbiosis.synthesis(chainTo)
            calldata = synthesis.interface.encodeFunctionData('revertBurn', ['0', externalId])
            receiveSide = synthesis.address
        } else {
            chainTo = MANAGER_CHAIN
            const synthesis = this.symbiosis.synthesis(chainTo)
            const [router, swapCalldata] = await this.buildSwapCalldata()
            const [burnToken, burnCalldata] = this.buildMetaBurnCalldata()

            calldata = synthesis.interface.encodeFunctionData('revertMetaBurn', [
                '0', // stableBridgingFee
                externalId,
                router,
                swapCalldata,
                synthesis.address,
                burnToken,
                burnCalldata,
            ])
            receiveSide = synthesis.address
        }

        const fee = await this.symbiosis.getBridgeFee({
            receiveSide,
            calldata,
            chainIdFrom: chainFrom,
            chainIdTo: chainTo,
        })

        const feeTokenAmount = new TokenAmount(this.request.fromTokenAmount.token, fee)
        if (this.request.fromTokenAmount.lessThan(feeTokenAmount)) {
            throw new Error(
                `Amount $${this.request.fromTokenAmount.toSignificant()} less than fee $${feeTokenAmount.toSignificant()}`,
                ErrorCode.AMOUNT_LESS_THAN_FEE
            )
        }

        return feeTokenAmount
    }

    private async getTransactionRequest(fee: TokenAmount, feeV2?: TokenAmount): Promise<TransactionRequest> {
        if (this.request.type === 'synthesize') {
            return this.getRevertSynthesizeTransactionRequest(fee)
        }

        if (this.request.type === 'burn') {
            return this.getRevertBurnTransactionRequest(fee)
        }

        return await this.getMetaRevertBurnTransactionRequest(fee, feeV2)
    }

    private getRevertSynthesizeTransactionRequest(fee: TokenAmount): TransactionRequest {
        const { internalId, chainIdTo, chainIdFrom } = this.request

        const synthesis = this.symbiosis.synthesis(chainIdTo)
        const otherPortal = this.symbiosis.portal(chainIdFrom)
        const otherBridge = this.symbiosis.bridge(chainIdFrom)

        return {
            to: synthesis.address,
            data: synthesis.interface.encodeFunctionData('revertSynthesizeRequest', [
                fee.raw.toString(),
                internalId,
                otherPortal.address,
                otherBridge.address,
                chainIdFrom,
                this.symbiosis.clientId,
            ]),
            chainId: chainIdTo,
        }
    }

    private getRevertBurnTransactionRequest(fee: TokenAmount): TransactionRequest {
        const { internalId, chainIdTo, chainIdFrom } = this.request

        const otherBridge = this.symbiosis.bridge(chainIdFrom)
        const portal = this.symbiosis.portal(chainIdTo)
        const otherSynthesis = this.symbiosis.synthesis(chainIdFrom)

        return {
            to: portal.address,
            data: portal.interface.encodeFunctionData('revertBurnRequest', [
                fee.raw.toString(),
                internalId,
                otherSynthesis.address,
                otherBridge.address,
                chainIdFrom,
                this.symbiosis.clientId,
            ]),
            chainId: chainIdTo,
        }
    }

    private async buildSwapCalldata(fee?: TokenAmount): Promise<[string, string]> {
        const { fromTokenAmount, chainIdFrom, chainIdTo } = this.request

        const tokenIn = this.symbiosis.findSyntheticStable(MANAGER_CHAIN, chainIdTo)
        if (!tokenIn) {
            throw new Error(`Cannot find synthetic token between manager chain and ${chainIdTo}`)
        }
        const tokenAmountIn = new TokenAmount(tokenIn, fromTokenAmount.raw) // sStable -> Stable
        const amount = fee ? new TokenAmount(tokenIn, JSBI.subtract(tokenAmountIn.raw, fee.raw)) : tokenAmountIn

        const managerStable = this.symbiosis.transitStable(MANAGER_CHAIN)
        const nervePool1 = this.symbiosis.nervePool(tokenIn, managerStable)
        const nerveTrade1 = new NerveTrade(
            amount,
            managerStable,
            this.slippage,
            this.deadline,
            nervePool1,
            this.symbiosis
        )
        await nerveTrade1.init()

        const tokenOut = this.symbiosis.findSyntheticStable(MANAGER_CHAIN, chainIdFrom)
        if (!tokenOut) throw new Error('Stable not found')

        const nervePool2 = this.symbiosis.nervePool(managerStable, tokenOut)
        const nerveTrade2 = new NerveTrade(
            nerveTrade1.amountOut,
            tokenOut,
            this.slippage,
            this.deadline,
            nervePool2,
            this.symbiosis
        )
        await nerveTrade2.init()

        const trades = [nerveTrade1, nerveTrade2]

        return [
            this.multicallRouter.address,
            this.multicallRouter.interface.encodeFunctionData('multicall', [
                trades[0].tokenAmountIn.raw.toString(),
                trades.map((i) => i.callData), // calldata
                trades.map((i) => i.pool.address), // receiveSides
                [
                    ...trades.map((i) => i.tokenAmountIn.token.address), // path
                    trades[trades.length - 1].amountOut.token.address,
                ],
                trades.map(() => 100), // offset
                this.symbiosis.metaRouter(MANAGER_CHAIN).address,
            ]),
        ]
    }

    private async getMetaRevertBurnTransactionRequest(
        fee: TokenAmount,
        feeV2?: TokenAmount
    ): Promise<TransactionRequest> {
        const { internalId, chainIdTo } = this.request

        const managerChainBridge = this.symbiosis.bridge(MANAGER_CHAIN)
        const portal = this.symbiosis.portal(chainIdTo)
        const managerChainSynthesis = this.symbiosis.synthesis(MANAGER_CHAIN)

        const [router, swapCalldata] = await this.buildSwapCalldata(fee)
        const [burnToken, burnCalldata] = this.buildMetaBurnCalldata(feeV2)

        return {
            to: portal.address,
            data: portal.interface.encodeFunctionData('metaRevertRequest', [
                {
                    stableBridgingFee: fee.raw.toString(),
                    internalID: internalId,
                    receiveSide: managerChainSynthesis.address,
                    managerChainBridge: managerChainBridge.address,
                    managerChainId: MANAGER_CHAIN,
                    sourceChainBridge: AddressZero,
                    sourceChainId: this.request.chainIdFrom,
                    sourceChainSynthesis: managerChainSynthesis.address,
                    router, // multicall router
                    swapCalldata,
                    burnToken,
                    burnCalldata,
                    clientID: this.symbiosis.clientId,
                },
            ]),
            chainId: chainIdTo,
        }
    }

    private async execute(transactionRequest: TransactionRequest, signer: Signer) {
        const transactionRequestWithGasLimit = { ...transactionRequest }

        const gasLimit = await signer.estimateGas(transactionRequest)

        transactionRequestWithGasLimit.gasLimit = calculateGasMargin(gasLimit)

        const transaction = await signer.sendTransaction(transactionRequestWithGasLimit)

        return {
            waitForMined: (confirmations = 1) => this.waitForMined(confirmations, transaction),
            transaction,
        }
    }

    private async waitForMined(confirmations: number, response: ContractTransaction) {
        const receipt = await response.wait(confirmations)

        return {
            receipt,
            waitForComplete: () => this.waitForComplete(),
        }
    }

    private getExternalId(): string {
        const { type, internalId, chainIdTo, revertableAddress } = this.request

        let contractAddress: string
        if (type === 'synthesize') {
            contractAddress = this.symbiosis.synthesis(chainIdTo).address
        } else {
            contractAddress = this.symbiosis.portal(chainIdTo).address
        }

        return getExternalId({ internalId, chainId: chainIdTo, revertableAddress, contractAddress })
    }
}
