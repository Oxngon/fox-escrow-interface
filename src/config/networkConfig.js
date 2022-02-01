export const networks = {
    mainnet: {
        chainId: 1666600000,
        rpc: {1666600000: "https://api.s0.t.hmny.io/"},
        network: "one"
    }, 
    testnet: {
        rpc: {1666700000: "https://api.s0.b.hmny.io"},
        chainId: 1666700000,
        network: 'one',
        qrcode: true
    }
}

export const activeNetwork = "testnet"

