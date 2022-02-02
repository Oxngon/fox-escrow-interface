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
          <a
            className="flex mt-2 mr-2"
            rel="noreferrer"
            target="_blank"
            href="https://www.foxswap.one/#/swap"
          >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="35 20 175 200"
                className="fill-current mr-2"
            >
              <path class="cls-2" d="M201.083,45.688l-.00293-.002a1.9273,1.9273,0,0,0-2.124.24072L150.80273,86.37549H98.9751L50.82373,45.92822a1.93215,1.93215,0,0,0-3.17187,1.61719l6.8164,94.4624a1.4471,1.4471,0,0,0,.02588.18848,1.60761,1.60761,0,0,0,.09082.30273,1.80369,1.80369,0,0,0,.23.47657,1.59992,1.59992,0,0,0,.10352.13867l58.6875,69.53418a1.80106,1.80106,0,0,0,.12793.17871l9.668,11.457a1.92958,1.92958,0,0,0,2.95166,0l9.65918-11.4375a1.25614,1.25614,0,0,0,.09765-.125l58.748-69.60742q.03662-.04395.07031-.09082a1.79,1.79,0,0,0,.27246-.55274c.00684-.01758.0127-.03515.01856-.05273a1.47393,1.47393,0,0,0,.08886-.41016L202.126,47.54688A1.93,1.93,0,0,0,201.083,45.688ZM154.17773,88.5874l43.76465-36.7622-6.127,84.90234ZM126.94922,199.793l-2.07373,2.26855-2.0625-2.26074,2.07031-1.9541Zm4.74512,12.168-6.80567,8.06445-6.811-8.07031,6.80078-4.67774Zm-3.89649-7.36719,3.291-3.60059a1.94208,1.94208,0,0,0-.10449-2.708l-4.78126-4.50489a1.919,1.919,0,0,0-2.0996-.36035,1.94955,1.94955,0,0,0-.61426.42774l-4.7085,4.44531a1.9379,1.9379,0,0,0-.10351,2.708l3.27929,3.59472-6.38379,4.3916L98.044,188.21875l8.44043-36.667a1.93161,1.93161,0,0,0-1.51954-2.33008l-45.09863-8.65527L99.21289,90.24023h51.35156l39.34668,50.32618-45.09765,8.65527h-.00489a1.93222,1.93222,0,0,0-1.51464,2.332l8.44043,36.66406-17.53516,20.77539Zm-25.53027-51.9541-7.33936,31.88672-32.4331-38.42774L61.395,144.7959Zm86.11523-7.84375-33.5332,39.73047-7.33984-31.88672ZM95.59912,88.5874,57.96191,136.72754,51.83545,51.8252Z"></path>
              </svg>
            <a>FoxSwap.one</a>
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
          <a
              className="flex mt-2 mr-2"
              rel="noreferrer"
              target="_blank"
              href=""
          >
            Audit
          </a>

          <Link to="/about" className="flex mt-2 mr-2">
            How to trade/about
          </Link>
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
