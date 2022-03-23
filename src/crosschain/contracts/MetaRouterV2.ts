/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
    BaseContract,
    BigNumber,
    BigNumberish,
    BytesLike,
    CallOverrides,
    ContractTransaction,
    Overrides,
    PayableOverrides,
    PopulatedTransaction,
    Signer,
    utils,
} from 'ethers'
import { FunctionFragment, Result } from '@ethersproject/abi'
import { Listener, Provider } from '@ethersproject/providers'
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from './common'

export declare namespace MetaRouteStructs {
    export type MetaMintTransactionStruct = {
        stableBridgingFee: BigNumberish
        amount: BigNumberish
        externalID: BytesLike
        tokenReal: string
        chainID: BigNumberish
        to: string
        swapTokens: string[]
        secondDexRouter: string
        secondSwapCalldata: BytesLike
        finalDexRouter: string
        finalSwapCalldata: BytesLike
    }

    export type MetaMintTransactionStructOutput = [
        BigNumber,
        BigNumber,
        string,
        string,
        BigNumber,
        string,
        string[],
        string,
        string,
        string,
        string
    ] & {
        stableBridgingFee: BigNumber
        amount: BigNumber
        externalID: string
        tokenReal: string
        chainID: BigNumber
        to: string
        swapTokens: string[]
        secondDexRouter: string
        secondSwapCalldata: string
        finalDexRouter: string
        finalSwapCalldata: string
    }

    export type MetaRouteTransactionV2Struct = {
        firstSwapCalldata: BytesLike
        secondSwapCalldata: BytesLike
        approvedTokens: string[]
        firstDexRouter: string
        secondDexRouter: string
        amount: BigNumberish
        nativeIn: boolean
        relayRecipient: string
        otherSideCalldata: BytesLike
    }

    export type MetaRouteTransactionV2StructOutput = [
        string,
        string,
        string[],
        string,
        string,
        BigNumber,
        boolean,
        string,
        string
    ] & {
        firstSwapCalldata: string
        secondSwapCalldata: string
        approvedTokens: string[]
        firstDexRouter: string
        secondDexRouter: string
        amount: BigNumber
        nativeIn: boolean
        relayRecipient: string
        otherSideCalldata: string
    }
}

export interface MetaRouterV2Interface extends utils.Interface {
    contractName: 'MetaRouterV2'
    functions: {
        'metaMintSwap((uint256,uint256,bytes32,address,uint256,address,address[],address,bytes,address,bytes))': FunctionFragment
        'metaRouteV2((bytes,bytes,address[],address,address,uint256,bool,address,bytes))': FunctionFragment
        'swap(address,uint256,address,bytes)': FunctionFragment
    }

    encodeFunctionData(functionFragment: 'metaMintSwap', values: [MetaRouteStructs.MetaMintTransactionStruct]): string
    encodeFunctionData(functionFragment: 'metaRouteV2', values: [MetaRouteStructs.MetaRouteTransactionV2Struct]): string
    encodeFunctionData(functionFragment: 'swap', values: [string, BigNumberish, string, BytesLike]): string

    decodeFunctionResult(functionFragment: 'metaMintSwap', data: BytesLike): Result
    decodeFunctionResult(functionFragment: 'metaRouteV2', data: BytesLike): Result
    decodeFunctionResult(functionFragment: 'swap', data: BytesLike): Result

    events: {}
}

export interface MetaRouterV2 extends BaseContract {
    contractName: 'MetaRouterV2'
    connect(signerOrProvider: Signer | Provider | string): this
    attach(addressOrName: string): this
    deployed(): Promise<this>

    interface: MetaRouterV2Interface

    queryFilter<TEvent extends TypedEvent>(
        event: TypedEventFilter<TEvent>,
        fromBlockOrBlockhash?: string | number | undefined,
        toBlock?: string | number | undefined
    ): Promise<Array<TEvent>>

    listeners<TEvent extends TypedEvent>(eventFilter?: TypedEventFilter<TEvent>): Array<TypedListener<TEvent>>
    listeners(eventName?: string): Array<Listener>
    removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this
    removeAllListeners(eventName?: string): this
    off: OnEvent<this>
    on: OnEvent<this>
    once: OnEvent<this>
    removeListener: OnEvent<this>

    functions: {
        metaMintSwap(
            _metaMintTransaction: MetaRouteStructs.MetaMintTransactionStruct,
            overrides?: Overrides & { from?: string | Promise<string> }
        ): Promise<ContractTransaction>

        metaRouteV2(
            _metarouteTransaction: MetaRouteStructs.MetaRouteTransactionV2Struct,
            overrides?: PayableOverrides & { from?: string | Promise<string> }
        ): Promise<ContractTransaction>

        swap(
            _token: string,
            _amount: BigNumberish,
            _router: string,
            _swapCalldata: BytesLike,
            overrides?: Overrides & { from?: string | Promise<string> }
        ): Promise<ContractTransaction>
    }

    metaMintSwap(
        _metaMintTransaction: MetaRouteStructs.MetaMintTransactionStruct,
        overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>

    metaRouteV2(
        _metarouteTransaction: MetaRouteStructs.MetaRouteTransactionV2Struct,
        overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>

    swap(
        _token: string,
        _amount: BigNumberish,
        _router: string,
        _swapCalldata: BytesLike,
        overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>

    callStatic: {
        metaMintSwap(
            _metaMintTransaction: MetaRouteStructs.MetaMintTransactionStruct,
            overrides?: CallOverrides
        ): Promise<void>

        metaRouteV2(
            _metarouteTransaction: MetaRouteStructs.MetaRouteTransactionV2Struct,
            overrides?: CallOverrides
        ): Promise<void>

        swap(
            _token: string,
            _amount: BigNumberish,
            _router: string,
            _swapCalldata: BytesLike,
            overrides?: CallOverrides
        ): Promise<void>
    }

    filters: {}

    estimateGas: {
        metaMintSwap(
            _metaMintTransaction: MetaRouteStructs.MetaMintTransactionStruct,
            overrides?: Overrides & { from?: string | Promise<string> }
        ): Promise<BigNumber>

        metaRouteV2(
            _metarouteTransaction: MetaRouteStructs.MetaRouteTransactionV2Struct,
            overrides?: PayableOverrides & { from?: string | Promise<string> }
        ): Promise<BigNumber>

        swap(
            _token: string,
            _amount: BigNumberish,
            _router: string,
            _swapCalldata: BytesLike,
            overrides?: Overrides & { from?: string | Promise<string> }
        ): Promise<BigNumber>
    }

    populateTransaction: {
        metaMintSwap(
            _metaMintTransaction: MetaRouteStructs.MetaMintTransactionStruct,
            overrides?: Overrides & { from?: string | Promise<string> }
        ): Promise<PopulatedTransaction>

        metaRouteV2(
            _metarouteTransaction: MetaRouteStructs.MetaRouteTransactionV2Struct,
            overrides?: PayableOverrides & { from?: string | Promise<string> }
        ): Promise<PopulatedTransaction>

        swap(
            _token: string,
            _amount: BigNumberish,
            _router: string,
            _swapCalldata: BytesLike,
            overrides?: Overrides & { from?: string | Promise<string> }
        ): Promise<PopulatedTransaction>
    }
}
