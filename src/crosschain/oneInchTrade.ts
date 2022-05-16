import { BigNumber } from 'ethers'
import JSBI from 'jsbi'
import { formatUnits } from '@ethersproject/units'

import { Percent, Token, TokenAmount, wrappedToken } from '../entities'
import { OneInchOracle } from './contracts'
import { getMulticall } from './multicall'
import { BIPS_BASE } from './constants'

export class OneInchTrade {
    public tokenAmountIn: TokenAmount
    public route!: Token[]
    public amountOut!: TokenAmount
    public callData!: string
    public priceImpact!: Percent
    public routerAddress!: string
    public oracle: OneInchOracle
    public callDataOffset?: number

    private readonly tokenOut: Token
    private readonly from: string
    private readonly to: string
    private readonly slippage: number

    public constructor(
        tokenAmountIn: TokenAmount,
        tokenOut: Token,
        from: string,
        to: string,
        slippage: number,
        oracle: OneInchOracle
    ) {
        this.tokenAmountIn = tokenAmountIn
        this.tokenOut = tokenOut
        this.from = from
        this.to = to
        this.slippage = slippage
        this.oracle = oracle
    }

    public async init() {
        const nativeAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
        let fromTokenAddress = this.tokenAmountIn.token.address
        if (this.tokenAmountIn.token.isNative) {
            fromTokenAddress = nativeAddress
        }

        let toTokenAddress = this.tokenOut.address
        if (this.tokenOut.isNative) {
            toTokenAddress = nativeAddress
        }

        const params = []
        params.push(`fromTokenAddress=${fromTokenAddress}`)
        params.push(`toTokenAddress=${toTokenAddress}`)
        params.push(`amount=${this.tokenAmountIn.raw.toString()}`)
        params.push(`fromAddress=${this.from}`)
        params.push(`destReceiver=${this.to}`)
        params.push(`slippage=${this.slippage}`)
        params.push(`disableEstimate=true`)
        params.push(`allowPartialFill=false`)

        const url = `https://api.1inch.io/v4.0/${this.tokenAmountIn.token.chainId}/swap?${params.join('&')}`

        const response = await fetch(url)
        const json = await response.json()
        if (response.status === 400) {
            throw new Error(`Cannot build 1inch trade: ${json['description']}`)
        }

        const tx: {
            from: string
            to: string
            data: string
            value: string
            gas: string
            gasPrice: string
        } = json['tx']
        const amountOutRaw: string = json['toTokenAmount']

        this.routerAddress = tx.to
        this.callData = tx.data
        this.callDataOffset = this.getOffset(tx.data)
        this.amountOut = new TokenAmount(this.tokenOut, amountOutRaw)
        this.route = [this.tokenAmountIn.token, this.tokenOut]
        this.priceImpact = await this.calculatePriceImpact(this.tokenAmountIn, this.amountOut)

        return this
    }

    private getOffset(callData: string) {
        const methods = [
            {
                sigHash: 'b0431182',
                offset: 100,
            },
            {
                sigHash: 'd0a3b665',
                offset: 100,
            },
            {
                sigHash: '7c025200',
                offset: 260,
            },
            {
                sigHash: 'e449022e',
                offset: 36,
            },
            {
                sigHash: '2e95b6c8',
                offset: 68,
            },
            {
                sigHash: '9994dd15',
                offset: 132,
            },
            {
                sigHash: 'baba5855',
                offset: 292,
            },
            {
                sigHash: 'bc80f1a8',
                offset: 68,
            },
        ]

        const sigHash = callData.slice(2, 10)

        const method = methods.find((i) => {
            return i.sigHash === sigHash
        })

        return method?.offset
    }

    private async calculatePriceImpact(tokenAmountIn: TokenAmount, tokenAmountOut: TokenAmount): Promise<Percent> {
        const tokens = [wrappedToken(tokenAmountIn.token), wrappedToken(tokenAmountOut.token)]

        const calls = tokens.map((token) => ({
            target: this.oracle.address,
            callData: this.oracle.interface.encodeFunctionData(
                'getRateToEth',
                [token.address, true] // use wrapper
            ),
        }))
        const multicall = await getMulticall(this.oracle.provider)
        const aggregated = await multicall.callStatic.tryAggregate(false, calls)

        const denominator = BigNumber.from(10).pow(18) // eth decimals

        const data = aggregated.map(([success, returnData], i): BigNumber | undefined => {
            if (!success || returnData === '0x') return
            const result = this.oracle.interface.decodeFunctionResult('getRateToEth', returnData)

            const numerator = BigNumber.from(10).pow(tokens[i].decimals)

            return BigNumber.from(result.weightedRate).mul(numerator).div(denominator)
        })

        if (!data[0] || !data[1]) {
            throw new Error('OneInch oracle: cannot to receive rate to ETH')
        }
        const multiplierPow = 18
        const multiplier = BigNumber.from(10).pow(multiplierPow)

        const spot = data[0].mul(multiplier).div(data[1]) // with e18

        // calc real rate
        const inBn = BigNumber.from(tokenAmountIn.raw.toString()).mul(
            BigNumber.from(10).pow(tokenAmountOut.token.decimals)
        )
        const outBn = BigNumber.from(tokenAmountOut.raw.toString()).mul(
            BigNumber.from(10).pow(tokenAmountIn.token.decimals)
        )
        const real = outBn.mul(multiplier).div(inBn)

        const impact = real.mul(multiplier).div(spot)
        const impactNumber = 1 - Number.parseFloat(formatUnits(impact, multiplierPow))

        return new Percent(parseInt(`${impactNumber * JSBI.toNumber(BIPS_BASE)}`).toString(), BIPS_BASE)
    }
}
