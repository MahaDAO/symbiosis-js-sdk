/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from 'ethers'
import { Provider, TransactionRequest } from '@ethersproject/providers'
import type { MetaRouter, MetaRouterInterface } from '../MetaRouter'

const _abi = [
    {
        inputs: [],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_token',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: '_amount',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: '_receiveSide',
                type: 'address',
            },
            {
                internalType: 'bytes',
                name: '_calldata',
                type: 'bytes',
            },
            {
                internalType: 'uint256',
                name: '_offset',
                type: 'uint256',
            },
        ],
        name: 'externalCall',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: 'uint256',
                        name: 'stableBridgingFee',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'amount',
                        type: 'uint256',
                    },
                    {
                        internalType: 'bytes32',
                        name: 'externalID',
                        type: 'bytes32',
                    },
                    {
                        internalType: 'address',
                        name: 'tokenReal',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'chainID',
                        type: 'uint256',
                    },
                    {
                        internalType: 'address',
                        name: 'to',
                        type: 'address',
                    },
                    {
                        internalType: 'address[]',
                        name: 'swapTokens',
                        type: 'address[]',
                    },
                    {
                        internalType: 'address',
                        name: 'secondDexRouter',
                        type: 'address',
                    },
                    {
                        internalType: 'bytes',
                        name: 'secondSwapCalldata',
                        type: 'bytes',
                    },
                    {
                        internalType: 'address',
                        name: 'finalReceiveSide',
                        type: 'address',
                    },
                    {
                        internalType: 'bytes',
                        name: 'finalCalldata',
                        type: 'bytes',
                    },
                    {
                        internalType: 'uint256',
                        name: 'finalOffset',
                        type: 'uint256',
                    },
                ],
                internalType: 'struct MetaRouteStructs.MetaMintTransaction',
                name: '_metaMintTransaction',
                type: 'tuple',
            },
        ],
        name: 'metaMintSwap',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: 'bytes',
                        name: 'firstSwapCalldata',
                        type: 'bytes',
                    },
                    {
                        internalType: 'bytes',
                        name: 'secondSwapCalldata',
                        type: 'bytes',
                    },
                    {
                        internalType: 'address[]',
                        name: 'approvedTokens',
                        type: 'address[]',
                    },
                    {
                        internalType: 'address',
                        name: 'firstDexRouter',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'secondDexRouter',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'amount',
                        type: 'uint256',
                    },
                    {
                        internalType: 'bool',
                        name: 'nativeIn',
                        type: 'bool',
                    },
                    {
                        internalType: 'address',
                        name: 'relayRecipient',
                        type: 'address',
                    },
                    {
                        internalType: 'bytes',
                        name: 'otherSideCalldata',
                        type: 'bytes',
                    },
                ],
                internalType: 'struct MetaRouteStructs.MetaRouteTransaction',
                name: '_metarouteTransaction',
                type: 'tuple',
            },
        ],
        name: 'metaRoute',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'metaRouterGateway',
        outputs: [
            {
                internalType: 'contract MetaRouterGateway',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
]

const _bytecode =
    '0x60a060405234801561001057600080fd5b503060405161001e90610060565b6001600160a01b039091168152602001604051809103906000f08015801561004a573d6000803e3d6000fd5b5060601b6001600160601b03191660805261006d565b6104d78061187d83390190565b60805160601c6117d06100ad60003960008181606b0152818161011a0152818161027a015281816105500152818161081a0152610fca01526117d06000f3fe60806040526004361061003f5760003560e01c8063a11b119814610044578063c394a5da14610059578063e1edd61c146100a9578063e1ee0f79146100c9575b600080fd5b61005761005236600461159a565b6100e9565b005b34801561006557600080fd5b5061008d7f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b03909116815260200160405180910390f35b3480156100b557600080fd5b506100576100c436600461155e565b610944565b3480156100d557600080fd5b506100576100e43660046113ca565b610e24565b60006100f8604083018361164e565b915061010c905060e0830160c08401611470565b6101f6576001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016639fc314c861014c604085018561164e565b600081811061015d5761015d61173b565b905060200201602081019061017291906113af565b336040517fffffffff0000000000000000000000000000000000000000000000000000000060e085901b1681526001600160a01b0392831660048201529116602482015260a08501356044820152606401600060405180830381600087803b1580156101dd57600080fd5b505af11580156101f1573d6000803e3d6000fd5b505050505b60a0820135610205838061169f565b1590506104905761021c60e0840160c08501611470565b61027057610270610230604085018561164e565b60008181106102415761024161173b565b905060200201602081019061025691906113af565b61026660808601606087016113af565b8560a00135610ebd565b6001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000166102aa60808501606086016113af565b6001600160a01b031614156103065760405162461bcd60e51b815260206004820181905260248201527f4d657461526f757465723a20696e76616c696420666972737420726f7574657260448201526064015b60405180910390fd5b60008061031960808601606087016113af565b6001600160a01b03163461032d878061169f565b60405161033b9291906115ef565b60006040518083038185875af1925050503d8060008114610378576040519150601f19603f3d011682016040523d82523d6000602084013e61037d565b606091505b5091509150816103df576103c6816040518060400160405280601d81526020017f4d657461526f757465723a2066697273742073776170206661696c6564000000815250610f8e565b60405162461bcd60e51b81526004016102fd919061161b565b6103ec604086018661164e565b60018181106103fd576103fd61173b565b905060200201602081019061041291906113af565b6040516370a0823160e01b81523060048201526001600160a01b0391909116906370a082319060240160206040518083038186803b15801561045357600080fd5b505afa158015610467573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061048b91906115d6565b925050505b8061049e602085018561169f565b15905061076d5760006104b4602086018661169f565b8080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250505050606481018490529050610546610501604087018761164e565b61050c6002886116e6565b81811061051b5761051b61173b565b905060200201602081019061053091906113af565b61054060a08801608089016113af565b85610ebd565b6001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001661058060a08701608088016113af565b6001600160a01b031614156105fd5760405162461bcd60e51b815260206004820152602160248201527f4d657461526f757465723a20696e76616c6964207365636f6e6420726f75746560448201527f720000000000000000000000000000000000000000000000000000000000000060648201526084016102fd565b60008061061060a08801608089016113af565b6001600160a01b03168360405161062791906115ff565b6000604051808303816000865af19150503d8060008114610664576040519150601f19603f3d011682016040523d82523d6000602084013e610669565b606091505b5091509150816106b2576103c6816040518060400160405280601e81526020017f4d657461526f757465723a207365636f6e642073776170206661696c65640000815250610f8e565b6106bf604088018861164e565b6106ca6001896116e6565b8181106106d9576106d961173b565b90506020020160208101906106ee91906113af565b6040516370a0823160e01b81523060048201526001600160a01b0391909116906370a082319060240160206040518083038186803b15801561072f57600080fd5b505afa158015610743573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061076791906115d6565b93505050505b6107c361077d604086018661164e565b6107886001876116e6565b8181106107975761079761173b565b90506020020160208101906107ac91906113af565b6107bd610100870160e088016113af565b83610ebd565b60006107d361010086018661169f565b8080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152505050506064810183905290506001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001661084b610100870160e088016113af565b6001600160a01b031614156108a25760405162461bcd60e51b815260206004820152601d60248201527f4d657461526f757465723a20696e76616c696420726563697069656e7400000060448201526064016102fd565b6000806108b6610100880160e089016113af565b6001600160a01b0316836040516108cd91906115ff565b6000604051808303816000865af19150503d806000811461090a576040519150601f19603f3d011682016040523d82523d6000602084013e61090f565b606091505b50915091508161093b576103c68160405180606001604052806022815260200161177960229139610f8e565b50505050505050565b600061095360c083018361164e565b60008181106109645761096461173b565b905060200201602081019061097991906113af565b905061098961010083018361169f565b159050610bc557600080610a2a6109a360c086018661164e565b60008181106109b4576109b461173b565b90506020020160208101906109c991906113af565b60208601356109df610100880160e089016113af565b6109ed61010089018961169f565b8080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525060649250610fc4915050565b9150915081610a72576103c6816040518060400160405280602081526020017f4d657461526f757465723a20696e7465726e616c2073776170206661696c6564815250610f8e565b6000610a8160c086018661164e565b6001818110610a9257610a9261173b565b9050602002016020810190610aa791906113af565b6040516370a0823160e01b81523060048201526001600160a01b0391909116906370a082319060240160206040518083038186803b158015610ae857600080fd5b505afa158015610afc573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b2091906115d6565b9050610b2f60c086018661164e565b905060021415610b8c57610b85610b4960c087018761164e565b6001818110610b5a57610b5a61173b565b9050602002016020810190610b6f91906113af565b610b7f60c0880160a089016113af565b836110c3565b5050505050565b610b9960c086018661164e565b6001818110610baa57610baa61173b565b9050602002016020810190610bbf91906113af565b93505050505b6040516370a0823160e01b81523060048201526000906001600160a01b038316906370a082319060240160206040518083038186803b158015610c0757600080fd5b505afa158015610c1b573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c3f91906115d6565b9050600080610ca88484610c5b61014089016101208a016113af565b610c696101408a018a61169f565b8080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152505050506101608a0135610fc4565b9150915081610cf0576103c6816040518060400160405280601d81526020017f4d657461526f757465723a2066696e616c2063616c6c206661696c6564000000815250610f8e565b6000610cff60c087018761164e565b6001610d0e60c08a018a61164e565b610d199291506116e6565b818110610d2857610d2861173b565b9050602002016020810190610d3d91906113af565b6040516370a0823160e01b81523060048201526001600160a01b0391909116906370a082319060240160206040518083038186803b158015610d7e57600080fd5b505afa158015610d92573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610db691906115d6565b90508015610e1c57610e1c610dce60c088018861164e565b6001610ddd60c08b018b61164e565b610de89291506116e6565b818110610df757610df761173b565b9050602002016020810190610e0c91906113af565b610b7f60c0890160a08a016113af565b505050505050565b600080610e6b88888888888080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152508a9250610fc4915050565b9150915081610eb3576103c6816040518060400160405280602081526020017f4d657461526f757465723a2065787465726e616c2063616c6c206661696c6564815250610f8e565b5050505050505050565b6040517fdd62ed3e0000000000000000000000000000000000000000000000000000000081523060048201526001600160a01b03838116602483015282919085169063dd62ed3e9060440160206040518083038186803b158015610f2057600080fd5b505afa158015610f34573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f5891906115d6565b1015610f8957610f8983837fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff61122b565b505050565b6060604483511015610fa1575080610fbe565b60048301925082806020019051810190610fbb91906114b1565b90505b92915050565b600060607f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316856001600160a01b0316141561104a5760405162461bcd60e51b815260206004820152601f60248201527f4d657461526f757465723a20696e76616c69642072656365697665536964650060448201526064016102fd565b611055878688610ebd565b8583850152846001600160a01b03168460405161107291906115ff565b6000604051808303816000865af19150503d80600081146110af576040519150601f19603f3d011682016040523d82523d6000602084013e6110b4565b606091505b50909890975095505050505050565b604080516001600160a01b038481166024830152604480830185905283518084039091018152606490920183526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fa9059cbb00000000000000000000000000000000000000000000000000000000179052915160009283929087169161114d91906115ff565b6000604051808303816000865af19150503d806000811461118a576040519150601f19603f3d011682016040523d82523d6000602084013e61118f565b606091505b50915091508180156111b95750805115806111b95750808060200190518101906111b99190611494565b610b855760405162461bcd60e51b815260206004820152602d60248201527f5472616e7366657248656c7065723a3a736166655472616e736665723a20747260448201527f616e73666572206661696c65640000000000000000000000000000000000000060648201526084016102fd565b604080516001600160a01b038481166024830152604480830185905283518084039091018152606490920183526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f095ea7b30000000000000000000000000000000000000000000000000000000017905291516000928392908716916112b591906115ff565b6000604051808303816000865af19150503d80600081146112f2576040519150601f19603f3d011682016040523d82523d6000602084013e6112f7565b606091505b50915091508180156113215750805115806113215750808060200190518101906113219190611494565b610b855760405162461bcd60e51b815260206004820152602b60248201527f5472616e7366657248656c7065723a3a73616665417070726f76653a2061707060448201527f726f7665206661696c656400000000000000000000000000000000000000000060648201526084016102fd565b80356001600160a01b03811681146113aa57600080fd5b919050565b6000602082840312156113c157600080fd5b610fbb82611393565b60008060008060008060a087890312156113e357600080fd5b6113ec87611393565b95506020870135945061140160408801611393565b9350606087013567ffffffffffffffff8082111561141e57600080fd5b818901915089601f83011261143257600080fd5b81358181111561144157600080fd5b8a602082850101111561145357600080fd5b602083019550809450505050608087013590509295509295509295565b60006020828403121561148257600080fd5b813561148d81611767565b9392505050565b6000602082840312156114a657600080fd5b815161148d81611767565b6000602082840312156114c357600080fd5b815167ffffffffffffffff808211156114db57600080fd5b818401915084601f8301126114ef57600080fd5b81518181111561150157611501611751565b604051601f8201601f19908116603f0116810190838211818310171561152957611529611751565b8160405282815287602084870101111561154257600080fd5b61155383602083016020880161170b565b979650505050505050565b60006020828403121561157057600080fd5b813567ffffffffffffffff81111561158757600080fd5b8201610180818503121561148d57600080fd5b6000602082840312156115ac57600080fd5b813567ffffffffffffffff8111156115c357600080fd5b8201610120818503121561148d57600080fd5b6000602082840312156115e857600080fd5b5051919050565b8183823760009101908152919050565b6000825161161181846020870161170b565b9190910192915050565b602081526000825180602084015261163a81604085016020870161170b565b601f01601f19169190910160400192915050565b6000808335601e1984360301811261166557600080fd5b83018035915067ffffffffffffffff82111561168057600080fd5b6020019150600581901b360382131561169857600080fd5b9250929050565b6000808335601e198436030181126116b657600080fd5b83018035915067ffffffffffffffff8211156116d157600080fd5b60200191503681900382131561169857600080fd5b60008282101561170657634e487b7160e01b600052601160045260246000fd5b500390565b60005b8381101561172657818101518382015260200161170e565b83811115611735576000848401525b50505050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b801515811461177557600080fd5b5056fe4d657461526f757465723a206f7468657220736964652063616c6c206661696c6564a264697066735822122069a8662bc6fd0eb357678dd9a37ec9dee73d9e6ac422a201ab4089494acc9d8164736f6c6343000807003360a060405234801561001057600080fd5b506040516104d73803806104d783398101604081905261002f91610044565b60601b6001600160601b031916608052610074565b60006020828403121561005657600080fd5b81516001600160a01b038116811461006d57600080fd5b9392505050565b60805160601c61043961009e6000396000818160550152818160a2015261017101526104396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80639fc314c81461003b578063dbec15bb14610050575b600080fd5b61004e610049366004610363565b6100a0565b005b6100777f000000000000000000000000000000000000000000000000000000000000000081565b60405173ffffffffffffffffffffffffffffffffffffffff909116815260200160405180910390f35b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16331461016a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f53796d623a2063616c6c6572206973206e6f7420746865206d657461726f757460448201527f657200000000000000000000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b61019683837f00000000000000000000000000000000000000000000000000000000000000008461019b565b505050565b6040805173ffffffffffffffffffffffffffffffffffffffff85811660248301528481166044830152606480830185905283518084039091018152608490920183526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f23b872dd00000000000000000000000000000000000000000000000000000000179052915160009283929088169161023a91906103c8565b6000604051808303816000865af19150503d8060008114610277576040519150601f19603f3d011682016040523d82523d6000602084013e61027c565b606091505b50915091508180156102a65750805115806102a65750808060200190518101906102a6919061039f565b610332576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152603160248201527f5472616e7366657248656c7065723a3a7472616e7366657246726f6d3a20747260448201527f616e7366657246726f6d206661696c65640000000000000000000000000000006064820152608401610161565b505050505050565b803573ffffffffffffffffffffffffffffffffffffffff8116811461035e57600080fd5b919050565b60008060006060848603121561037857600080fd5b6103818461033a565b925061038f6020850161033a565b9150604084013590509250925092565b6000602082840312156103b157600080fd5b815180151581146103c157600080fd5b9392505050565b6000825160005b818110156103e957602081860181015185830152016103cf565b818111156103f8576000828501525b50919091019291505056fea26469706673582212202568575dd38d51c811ca9abb487d12cf7f92601b834f2b8dba043bc452c3f35164736f6c63430008070033'

type MetaRouterConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>

const isSuperArgs = (xs: MetaRouterConstructorParams): xs is ConstructorParameters<typeof ContractFactory> =>
    xs.length > 1

export class MetaRouter__factory extends ContractFactory {
    constructor(...args: MetaRouterConstructorParams) {
        if (isSuperArgs(args)) {
            super(...args)
        } else {
            super(_abi, _bytecode, args[0])
        }
        this.contractName = 'MetaRouter'
    }

    deploy(overrides?: Overrides & { from?: string | Promise<string> }): Promise<MetaRouter> {
        return super.deploy(overrides || {}) as Promise<MetaRouter>
    }
    getDeployTransaction(overrides?: Overrides & { from?: string | Promise<string> }): TransactionRequest {
        return super.getDeployTransaction(overrides || {})
    }
    attach(address: string): MetaRouter {
        return super.attach(address) as MetaRouter
    }
    connect(signer: Signer): MetaRouter__factory {
        return super.connect(signer) as MetaRouter__factory
    }
    static readonly contractName: 'MetaRouter'
    public readonly contractName: 'MetaRouter'
    static readonly bytecode = _bytecode
    static readonly abi = _abi
    static createInterface(): MetaRouterInterface {
        return new utils.Interface(_abi) as MetaRouterInterface
    }
    static connect(address: string, signerOrProvider: Signer | Provider): MetaRouter {
        return new Contract(address, _abi, signerOrProvider) as MetaRouter
    }
}