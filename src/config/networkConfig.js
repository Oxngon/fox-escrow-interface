export const networks = {
    bsc: {
        chainId: 56,
        rpc: {56: "https://bsc-dataseed.binance.org/"},
        network: "binance"
    }, 
    bscTestnet: {
        rpc: {1666700000: "https://api.s0.b.hmny.io"},
        chainId: 1666700000,
        network: 'one',
        qrcode: true
    }
}

export const activeNetwork = "bscTestnet"

