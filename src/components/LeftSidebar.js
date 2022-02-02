import React from "react";

export default function LeftSidebar() {
  return (
    <div className="left-sidebar">
      <p className="left-side-head">PLEASE READ</p>
      <div class="left-side-content">
        <p className="text-center mt-3 mb-0">How to sell locked tokens:</p>
        <br />
        <p className="mb-0">
          1. Deploy an Offer contract, choosing your locked token, price per
          token, and stablecoin.
        </p>
        <br />
        <p className="mb-0">
          2. Fund the OTC Offer contract with your locked tokens.
        </p>
        <br />
        <p className="message-box border border-warning">
          <u>WARNING:</u>
          <br />
          This will transfer <b>ALL</b> of your locked AND unlocked tokens
          - make sure you only have locked version of the token you are
          selling in your wallet.
        </p>
        <br />
      </div>
    </div>
  );
}
