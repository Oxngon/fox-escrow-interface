import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Link, Route, Router } from "react-router-dom";

function RightSidebar() {
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
  const [balance, setBalance] = useState(0);
  useEffect(async () => {
    console.log(active);
    if (!active) return;
    const provider = library.getSigner();
    const balance = ethers.utils.formatEther(await library.getBalance(account));

    console.log('balance', balance);
    setBalance(parseFloat(balance).toFixed(2));
  }, [active]);

  return (
    <div className="right-sidebar">
      <div className="right-sidebar-social">
        <div>
          <Link to="/about" className="flex mt-2 mr-2">
            How to trade/about
          </Link>
          <a
            className="flex mt-2 mr-2"
            rel="noreferrer"
            target="_blank"
            href=""
          >
            Audit
          </a>
          <a
            className="flex mt-2 mr-2"
            rel="noreferrer"
            target="_blank"
            href=""
          >
            FoxSwap.one
          </a>
          <a
            rel="noreferrer"
            target="_blank"
            href="https://discord.gg/p75xpZMcgQ"
          >
            <div className="flex mt-2 mr-2">
              <a
                target="_blank"
                href="https://discord.gg/p75xpZMcgQ"
                rel="noopener noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="35 20 175 200"
                  class="fill-current mr-2"
                >
                  <path d="M104.4 103.9c-5.7 0-10.2 5-10.2 11.1s4.6 11.1 10.2 11.1c5.7 0 10.2-5 10.2-11.1.1-6.1-4.5-11.1-10.2-11.1zM140.9 103.9c-5.7 0-10.2 5-10.2 11.1s4.6 11.1 10.2 11.1c5.7 0 10.2-5 10.2-11.1s-4.5-11.1-10.2-11.1z"></path>
                  <path d="M189.5 20h-134C44.2 20 35 29.2 35 40.6v135.2c0 11.4 9.2 20.6 20.5 20.6h113.4l-5.3-18.5 12.8 11.9 12.1 11.2 21.5 19V40.6c0-11.4-9.2-20.6-20.5-20.6zm-38.6 130.6s-3.6-4.3-6.6-8.1c13.1-3.7 18.1-11.9 18.1-11.9-4.1 2.7-8 4.6-11.5 5.9-5 2.1-9.8 3.5-14.5 4.3-9.6 1.8-18.4 1.3-25.9-.1-5.7-1.1-10.6-2.7-14.7-4.3-2.3-.9-4.8-2-7.3-3.4-.3-.2-.6-.3-.9-.5-.2-.1-.3-.2-.4-.3-1.8-1-2.8-1.7-2.8-1.7s4.8 8 17.5 11.8c-3 3.8-6.7 8.3-6.7 8.3-22.1-.7-30.5-15.2-30.5-15.2 0-32.2 14.4-58.3 14.4-58.3 14.4-10.8 28.1-10.5 28.1-10.5l1 1.2c-18 5.2-26.3 13.1-26.3 13.1s2.2-1.2 5.9-2.9c10.7-4.7 19.2-6 22.7-6.3.6-.1 1.1-.2 1.7-.2 6.1-.8 13-1 20.2-.2 9.5 1.1 19.7 3.9 30.1 9.6 0 0-7.9-7.5-24.9-12.7l1.4-1.6s13.7-.3 28.1 10.5c0 0 14.4 26.1 14.4 58.3 0 0-8.5 14.5-30.6 15.2z"></path>
                </svg>
              </a>
              <a>Discord</a>
            </div>
          </a>
          <a
            rel="noreferrer"
            target="_blank"
            href="https://discord.gg/p75xpZMcgQ"
          >
            <div className="flex mt-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-telegram mr-2"
                viewBox="0 0 16 16"
              >
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.23.05-.012.12-.026.166.016.047.041.042.12.037.141-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8.154 8.154 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629.093.06.183.125.27.187.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.426 1.426 0 0 0-.013-.315.337.337 0 0 0-.114-.217.526.526 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09z"></path>
              </svg>
              <a>Telegram</a>
            </div>
          </a>
        </div>
      </div>
      {active ? (
        <>
          <Button
            variant="primary"
            className="btn button rounded-btn btn-md side-button"
          >
            Connected <br /> {account.slice(0, 5)}...
          </Button>
          <Button
            variant="primary"
            className="btn button rounded-btn btn-md side-button"
          >
            Balance <br /> {balance}
          </Button>
        </>
      ) : (
        // <input type='button' className='btn button rounded-btn mt-4 capitalize btn-md mx-2 lg:w-18 text-xs' value='Connect Wallet' />
        <Button
          variant="primary"
          className="btn button rounded-btn btn-md side-button"
        >
          Connect Wallet
        </Button>
      )}
      {/* <input type='button' className='btn rounded-btn mt-4 capitalize btn-md mx-2 lg:w-18 text-xs' value='Connect Wallet' /> */}

      {/* </Router> */}
    </div>
  );
}

export default RightSidebar;
