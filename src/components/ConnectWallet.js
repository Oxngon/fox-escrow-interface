import React, { useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import logo from "../assets/images/foxswap.svg";

import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { injected } from "../helper/connectors";
import { activeNetwork, networks } from "../config/networkConfig";
import { NoEthereumProviderError } from "@web3-react/injected-connector";
function ConnectWallet(props) {
  const {
    active,
    error,
    account,
    library,
    connector,
    activate,
    deactivate,
    onActivate,
  } = useWeb3React();

  useEffect(async () => {
    if (error) {
      if (error instanceof UnsupportedChainIdError) {
        const provider = await connector.getProvider();
        const hexString = networks[activeNetwork]["chainId"].toString(16);
        provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x" + hexString }],
        });
      } else if (error instanceof NoEthereumProviderError) {
        alert("No Ethereum Provider found");
        // console.log("No Metamask")
      }
    }
  }, [error]);
  const connect = async () => {
    await activate(injected);
  };
  return (
    <div class="main-div">
      <Card className="main-connect-card">
        <Card.Header className="main-card-head">
          FoxSwap Escrow
          {/* <Card.Title className="title border-b text-center pb-3 h5">
            dfk.market
          </Card.Title> */}
        </Card.Header>
        <Card.Body>
          <div className="flex content">
            <div className="hidden flex pb-4 mt-4 mb-4">
              <Card.Img className="card-image" src={logo} />
            </div>
            <Card.Text className="card-body-text text-center p-4 mb-4">
              Safe and secure way to trade locked tokens, like JEWEL and VIPER
            </Card.Text>
            <div className="hidden flex mt-4 pb-4 mb-4">
              <Card.Img className="card-image" src={logo} />
            </div>
          </div>

          <div class="text-center">
            {active ? (
              <Button
                variant="primary"
                className="btn button rounded-btn btn-md card-btn"
                value="View Market"
                onClick={props.viewMarketClick}
              >
                View Market
              </Button>
            ) : (
              //   <input
              //     type="button"
              //     class="btn button btn-md rounded-btn w-48 capitalize z-50 self-center mb-10"
              //     value="View Market"
              //     onClick={props.viewMarketClick}
              //   />
              <Button
                variant="primary"
                className="btn button rounded-btn btn-md card-btn"
                value="Connect Wallet"
                onClick={connect}
              >
                Connect Wallet
              </Button>
              //   <input
              //     type="button"
              //     class="btn button btn-md rounded-btn w-48 capitalize z-50 self-center mb-10"
              //     value="Connect Wallet"
              //     onClick={connect}
              //   />
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ConnectWallet;
