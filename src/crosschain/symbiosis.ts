import { StaticJsonRpcProvider } from '@ethersproject/providers'
import { BigNumber, Signer, utils } from 'ethers'
import fetch from 'isomorphic-unfetch'
import JSBI from 'jsbi'
import { ChainId } from '../constants'
import { Chain, chains, Token, TokenAmount, wrappedToken } from '../entities'
import { Bridging } from './bridging'
import {
    Aave,
    Aave__factory,
    AdaRouter,
    AdaRouter__factory,
    AvaxRouter,
    AvaxRouter__factory,
    BeefyVault,
    BeefyVault__factory,
    BenqiQiErc20,
    BenqiQiErc20__factory,
    Bridge,
    Bridge__factory,
    CreamCErc20,
    CreamCErc20__factory,
    CreamComptroller,
    CreamComptroller__factory,
    Fabric,
    Fabric__factory,
    KavaRouter,
    KavaRouter__factory,
    MetaRouter,
    MetaRouter__factory,
    MulticallRouter,
    MulticallRouter__factory,
    OmniPool,
    OmniPool__factory,
    OmniPoolOracle,
    OmniPoolOracle__factory,
    OneInchOracle,
    OneInchOracle__factory,
    Ooki,
    Ooki__factory,
    Portal,
    Portal__factory,
    RenGatewayRegistryV2,
    RenGatewayRegistryV2__factory,
    RenMintGatewayV3,
    RenMintGatewayV3__factory,
    SyncSwapLaunchPool,
    SyncSwapLaunchPool__factory,
    Synthesis,
    Synthesis__factory,
    UniLikeRouter,
    UniLikeRouter__factory,
} from './contracts'
import { Error, ErrorCode } from './error'
import { getPendingRequests, PendingRequest, SynthesizeRequestFinder } from './pending'
import { RevertPending } from './revert'
import { Swapping } from './swapping'
import { ChainConfig, Config, OmniPoolConfig } from './types'
import { ONE_INCH_ORACLE_MAP } from './constants'
import { Zapping } from './zapping'
import { ZappingAave } from './zappingAave'
import { ZappingCream } from './zappingCream'
import { ZappingRenBTC } from './zappingRenBTC'
import { ZappingOoki } from './zappingOoki'

import { config as mainnet } from './config/mainnet'
import { config as testnet } from './config/testnet'
import { ZappingBeefy } from './zappingBeefy'
import { BestPoolSwapping } from './bestPoolSwapping'
import { ConfigCache } from './config/cache/cache'

export type ConfigName = 'testnet' | 'mainnet'

export class Symbiosis {
    public providers: Map<ChainId, StaticJsonRpcProvider>

    public readonly config: Config
    public readonly clientId: string
    public defaultOmniPool: OmniPoolConfig

    private readonly configCache: ConfigCache

    public constructor(config: ConfigName, clientId: string) {
        if (config === 'mainnet') {
            this.config = mainnet
        } else if (config === 'testnet') {
            this.config = testnet
        } else {
            throw new Error('Unknown config name')
        }

        this.configCache = new ConfigCache(config)

        // FIXME mustn't be default pool
        this.defaultOmniPool = this.config.omniPools[0]

        this.clientId = utils.formatBytes32String(clientId)

        this.providers = new Map(
            this.config.chains.map((i) => {
                return [i.id, new StaticJsonRpcProvider(i.rpc, i.id)]
            })
        )
    }

    public validateSwapAmounts(amount: TokenAmount): void {
        const { token } = amount
        const wrapped = wrappedToken(token)
        const threshold = this.configCache.getTokenThreshold(wrapped, token.isSynthetic ? 'Synthesis' : 'Portal')
        if (BigNumber.from(amount.raw.toString()).lt(threshold)) {
            const formattedThreshold = utils.formatUnits(threshold, token.decimals)

            throw new Error(
                `The amount is too low: ${amount.toFixed(2)}. Min amount: ${formattedThreshold}`,
                ErrorCode.AMOUNT_TOO_LOW
            )
        }
    }

    public chains(): Chain[] {
        const ids = this.config.chains.map((i) => i.id)
        return chains.filter((i) => ids.includes(i.id))
    }

    public newBridging() {
        return new Bridging(this)
    }

    public newSwapping() {
        return new Swapping(this)
    }

    public bestPoolSwapping() {
        return new BestPoolSwapping(this)
    }

    public newRevertPending(request: PendingRequest) {
        return new RevertPending(this, request)
    }

    public newZapping(omniPoolConfig: OmniPoolConfig) {
        return new Zapping(this, omniPoolConfig)
    }

    public newZappingAave() {
        return new ZappingAave(this)
    }

    public newZappingCream() {
        return new ZappingCream(this)
    }

    public newZappingRenBTC() {
        return new ZappingRenBTC(this)
    }

    public newZappingBeefy() {
        return new ZappingBeefy(this)
    }

    public newZappingOoki() {
        return new ZappingOoki(this)
    }

    public getPendingRequests(
        address: string,
        synthesizeRequestFinder?: SynthesizeRequestFinder
    ): Promise<PendingRequest[]> {
        return getPendingRequests(this, address, synthesizeRequestFinder)
    }

    public getProvider(chainId: ChainId): StaticJsonRpcProvider {
        const provider = this.providers.get(chainId)
        if (!provider) {
            throw new Error('No provider for given chainId')
        }
        return provider
    }

    public portal(chainId: ChainId, signer?: Signer): Portal {
        const address = this.chainConfig(chainId).portal
        const signerOrProvider = signer || this.getProvider(chainId)

        return Portal__factory.connect(address, signerOrProvider)
    }

    public synthesis(chainId: ChainId, signer?: Signer): Synthesis {
        const address = this.chainConfig(chainId).synthesis
        const signerOrProvider = signer || this.getProvider(chainId)

        return Synthesis__factory.connect(address, signerOrProvider)
    }

    public bridge(chainId: ChainId, signer?: Signer): Bridge {
        const address = this.chainConfig(chainId).bridge
        const signerOrProvider = signer || this.getProvider(chainId)

        return Bridge__factory.connect(address, signerOrProvider)
    }

    public fabric(chainId: ChainId, signer?: Signer): Fabric {
        const address = this.chainConfig(chainId).fabric
        const signerOrProvider = signer || this.getProvider(chainId)

        return Fabric__factory.connect(address, signerOrProvider)
    }

    public uniLikeRouter(chainId: ChainId, signer?: Signer): UniLikeRouter {
        const address = this.chainConfig(chainId).router
        const signerOrProvider = signer || this.getProvider(chainId)

        return UniLikeRouter__factory.connect(address, signerOrProvider)
    }

    public avaxRouter(chainId: ChainId, signer?: Signer): AvaxRouter {
        const address = this.chainConfig(chainId).router
        const signerOrProvider = signer || this.getProvider(chainId)

        return AvaxRouter__factory.connect(address, signerOrProvider)
    }

    public adaRouter(chainId: ChainId, signer?: Signer): AdaRouter {
        const address = this.chainConfig(chainId).router
        const signerOrProvider = signer || this.getProvider(chainId)

        return AdaRouter__factory.connect(address, signerOrProvider)
    }

    public kavaRouter(chainId: ChainId, signer?: Signer): KavaRouter {
        const address = this.chainConfig(chainId).router
        const signerOrProvider = signer || this.getProvider(chainId)

        return KavaRouter__factory.connect(address, signerOrProvider)
    }

    public creamCErc20ByAddress(address: string, chainId: ChainId, signer?: Signer): CreamCErc20 {
        const signerOrProvider = signer || this.getProvider(chainId)

        return CreamCErc20__factory.connect(address, signerOrProvider)
    }

    public benqiQiErc20ByAddress(address: string, chainId: ChainId, signer?: Signer): BenqiQiErc20 {
        const signerOrProvider = signer || this.getProvider(chainId)

        return BenqiQiErc20__factory.connect(address, signerOrProvider)
    }

    public creamComptroller(chainId: ChainId, signer?: Signer): CreamComptroller {
        const address = this.chainConfig(chainId).creamComptroller
        const signerOrProvider = signer || this.getProvider(chainId)

        return CreamComptroller__factory.connect(address, signerOrProvider)
    }

    public aavePool(chainId: ChainId, signer?: Signer): Aave {
        const address = this.chainConfig(chainId).aavePool
        const signerOrProvider = signer || this.getProvider(chainId)

        return Aave__factory.connect(address, signerOrProvider)
    }

    public multicallRouter(chainId: ChainId, signer?: Signer): MulticallRouter {
        const address = this.chainConfig(chainId).multicallRouter
        const signerOrProvider = signer || this.getProvider(chainId)

        return MulticallRouter__factory.connect(address, signerOrProvider)
    }

    public metaRouter(chainId: ChainId, signer?: Signer): MetaRouter {
        const address = this.chainConfig(chainId).metaRouter
        const signerOrProvider = signer || this.getProvider(chainId)

        return MetaRouter__factory.connect(address, signerOrProvider)
    }

    public omniPool(config: OmniPoolConfig, signer?: Signer): OmniPool {
        const { address, chainId } = config
        const signerOrProvider = signer || this.getProvider(chainId)

        return OmniPool__factory.connect(address, signerOrProvider)
    }

    public omniPoolOracle(config: OmniPoolConfig, signer?: Signer): OmniPoolOracle {
        const { oracle, chainId } = config
        const signerOrProvider = signer || this.getProvider(chainId)

        return OmniPoolOracle__factory.connect(oracle, signerOrProvider)
    }

    public oneInchOracle(chainId: ChainId, signer?: Signer): OneInchOracle {
        const address = ONE_INCH_ORACLE_MAP[chainId]
        if (!address) {
            throw new Error(`Could not find oneInch off-chain oracle on chain ${chainId}`)
        }
        const signerOrProvider = signer || this.getProvider(chainId)

        return OneInchOracle__factory.connect(address, signerOrProvider)
    }

    public renRenGatewayRegistry(chainId: ChainId, signer?: Signer): RenGatewayRegistryV2 {
        const address = this.chainConfig(chainId).renGatewayRegistry
        const signerOrProvider = signer || this.getProvider(chainId)

        return RenGatewayRegistryV2__factory.connect(address, signerOrProvider)
    }

    public renMintGatewayByAddress(address: string, chainId: ChainId, signer?: Signer): RenMintGatewayV3 {
        const signerOrProvider = signer || this.getProvider(chainId)

        return RenMintGatewayV3__factory.connect(address, signerOrProvider)
    }

    public beefyVault(address: string, chainId: ChainId, signer?: Signer): BeefyVault {
        const signerOrProvider = signer || this.getProvider(chainId)

        return BeefyVault__factory.connect(address, signerOrProvider)
    }

    public ookiIToken(address: string, chainId: ChainId, signer?: Signer): Ooki {
        const signerOrProvider = signer || this.getProvider(chainId)

        return Ooki__factory.connect(address, signerOrProvider)
    }

    public syncSwapLaunchPool(address: string, chainId: ChainId, signer?: Signer): SyncSwapLaunchPool {
        const signerOrProvider = signer || this.getProvider(chainId)

        return SyncSwapLaunchPool__factory.connect(address, signerOrProvider)
    }

    public getRepresentation(token: Token, chainId: ChainId): Token | undefined {
        return this.configCache.getRepresentation(token, chainId)
    }

    public getOmniPoolIndex(token: Token, omniPoolConfig: OmniPoolConfig): number {
        return this.configCache.getOmniPoolIndex(token, omniPoolConfig)
    }

    public async getBridgeFee({
        calldata,
        receiveSide,
        chainIdFrom,
        chainIdTo,
    }: {
        calldata: string
        receiveSide: string
        chainIdFrom: ChainId
        chainIdTo: ChainId
    }): Promise<JSBI> {
        const params = {
            chain_id_from: chainIdFrom,
            chain_id_to: chainIdTo,
            receive_side: receiveSide,
            call_data: calldata,
            client_id: utils.parseBytes32String(this.clientId),
        }

        return fetch(`${this.config.advisor.url}/v1/swap/price`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        })
            .then(async (response) => {
                if (!response.ok) {
                    return Promise.reject(new Error(await response.text()))
                }
                return response.json()
            })
            .then(({ price }) => JSBI.BigInt(price))
    }

    public filterBlockOffset(chainId: ChainId): number {
        return this.chainConfig(chainId).filterBlockOffset
    }

    public async getFromBlockWithOffset(chainId: ChainId): Promise<number> {
        const provider = this.getProvider(chainId)

        const blockNumber = await provider.getBlockNumber()

        const offset = this.filterBlockOffset(chainId)

        return Math.max(0, blockNumber - offset)
    }

    public dexFee(chainId: ChainId): number {
        return this.chainConfig(chainId).dexFee
    }

    public chainConfig(chainId: ChainId): ChainConfig {
        const config = this.config.chains.find((item) => {
            return item.id === chainId
        })
        if (!config) throw new Error(`Could not config by given chainId: ${chainId}`)
        return config
    }

    // === stables ===

    public stables(): Token[] {
        return this.config.chains
            .map((chainConfig) => {
                return chainConfig.stables.map((params) => {
                    return new Token(params)
                })
            })
            .reduce((acc, tokens) => {
                return [...acc, ...tokens]
            }, [])
    }

    public findStable(address: string, chainId: ChainId, chainFromId?: ChainId): Token | undefined {
        return this.stables().find((token) => {
            const condition = token.address.toLowerCase() === address.toLowerCase() && token.chainId === chainId

            if (chainFromId === undefined) return condition

            return condition && token.chainFromId === chainFromId
        })
    }

    protected findTransitStables(chainId: ChainId): Token[] {
        return this.stables().filter((token) => {
            return token.chainId === chainId && !token.isSynthetic
        })
    }

    public transitStable(chainId: ChainId, omniPoolConfig: OmniPoolConfig): Token {
        const stables = this.findTransitStables(chainId)
        if (stables.length === 0) {
            throw new Error(`Cannot find transit stable token for chain ${chainId}`)
        }

        console.log({ omniPoolConfig }) // FIXME

        return stables[0]
    }
}
