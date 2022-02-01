import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
const { networks, activeNetwork } = require('../config/networkConfig');

export const injected = new InjectedConnector({
  supportedChainIds: [networks[activeNetwork]['chainId']],
})
console.log(injected.supportedChainIds);
export const walletconnect = new WalletConnectConnector(networks[activeNetwork])


export const resetWalletConnector = (connector) => {
  // console.log(connector.walletConnectProvider)
  if (connector && connector instanceof WalletConnectConnector && connector.walletConnectProvider) { 
    connector.walletConnectProvider = undefined
  }
}


