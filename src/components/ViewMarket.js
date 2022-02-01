import { useWeb3React } from "@web3-react/core";
import { Contract } from "ethers-multicall";
import React, { useEffect, useRef, useState } from "react";
import { Button, Table } from "react-bootstrap";
import logo from "../assets/images/foxswap.svg";
import CreatOfferModal from "../components/modal/CreatOfferModal";
import ERC20Token from "../contracts/ERC20Token";
import LockedTokenLens from "../contracts/LockedTokenLens";
import OfferContract from "../contracts/Offer";
import {ZERO_ADDRESS, contractAddress, map as addressToContract } from "../helper/utils";
import Row from "./Row";
import OfferABI from "../contracts/abi/OfferABI.json";
import { initMultiCall } from "../contracts/multicall";
import OfferFactory from "../contracts/OfferFactory";

function numberWithCommas(x) {
  return parseInt(x).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function ViewMarket() {
  const [modalShow, setModalShow] = React.useState(false);
  const { library, account } = useWeb3React();
  const [activeoffers, setActiveOffer] = useState([]);
  const [userActiveoffers, setUserActiveOffer] = useState([]);
  const [totalVolume, setTotalVolume] = useState('');
  const [offeresData, setOffersData] = useState([]);
  const [sellersAddress, setSellersAddress] = useState([]);

  useEffect(async () => {
    if (offeresData.length === 0 || sellersAddress.length === 0) return;

    const userOffer = [];
    for (let i = 0; i < offeresData.length; i++) {
      if (sellersAddress[i].toLowerCase() === account.toLowerCase()) {
        console.log("user offer", offeresData[i]);
        userOffer.push(offeresData[i]);
      }
    }

    setUserActiveOffer(userOffer);
  }, [account, offeresData, sellersAddress]);

  const fetchTotalVolume = async () => {
    const factory = new OfferFactory(
        contractAddress.offerFactory,
        library.getSigner()
    );
    const totalVolume = await factory.totalVolume();
    console.log('totalVolume', totalVolume);
    setTotalVolume(totalVolume);
  }

  const fetchData = async () => {
    const lockedTokenLens = new LockedTokenLens(
      contractAddress.lockedTokenLens,
      library.getSigner()
    );
    let data = await lockedTokenLens.getAllActiveOfferInfo(
      contractAddress.offerFactory
    );

    let activeoffers_local = [];
    for (let i = 0; i < data[0].length; i++) {
      if (data[0][i] !== ZERO_ADDRESS) {
        const lockedToken = addressToContract.get(data[0][i].toLowerCase());
        console.log('lockedToken', lockedToken);
        const lockedBalance = ERC20Token.getFromWei(data[2][i].toString(), 18);
        console.log(i, lockedToken, lockedBalance)
        const {decimals: tokenWantedecimal, symbol: tokenWantedSymbol} =
            addressToContract.get(data[3][i].toLowerCase());
        const amountwanted = ERC20Token.getFromWei(
            data[4][i].toString(),
            tokenWantedecimal
        );
        const pricePerToken = (data[4][i] / data[2][i]).toFixed(3);
        activeoffers_local.push({
          lockedTokens: data[0][i],
          offerAddresses: data[1][i],
          lockedBalances: lockedBalance.toString(),
          tokenWanted: data[4][i].toString(),
          stableCoin: data[3][i].toLowerCase(),
          amountWantedInWei: data[4][i].toString(),
          amountWanted: amountwanted.toString(),
          pricePerToken,
          lockedToken,
          tokenWantedSymbol,
        });
      }
    }
    setOffersData(activeoffers_local);
    setActiveOffer(activeoffers_local);
    let sellers = activeoffers_local.map((ele) => {
      const contract = new Contract(ele.offerAddresses, OfferABI);
      return contract.seller();
    });
    const callInstance = await initMultiCall();
    setSellersAddress(await callInstance.all(sellers));
  };

  const onHide = (isSuccess = false) => {
    if (isSuccess) fetchData(); fetchTotalVolume();
    setModalShow(false);
  };

  useEffect(() => {
    fetchData();
    fetchTotalVolume();
  }, []);
  return (
    <div className="market-main-div">
      <div className="market-head">
        <div className="market-head-content">
          <img className="card-image mt-3" src={logo} />

          <div className="text-center p-3">
            <div className="card-body-text text-center">
              Total Traded Volume
            </div>
            <div className="total-volume p-3">$ {numberWithCommas(totalVolume)}</div>
          </div>

          <img className="card-image mt-3" src={logo} />
        </div>
      </div>
      <div className="market-btn-group">
        {/* <input type="button" class="btn btn-primary btn-md rounded-btn capitalize mb-10" value="Create Offer" /> */}
        <Button
          variant="primary"
          className="btn button rounded-btn btn-md market-btn"
          value="create offer"
          onClick={() => setModalShow(true)}
        >
          Create Offer
        </Button>

        <Button className="btn button btn-md rounded-btn market-btn">
          Lowest Price
        </Button>

        {/* <input
          className="token-address"
          type="text"
          min={1e-18}
          step={1e-18}
          value={tokenAddress}
          placeholder="user address"
          onChange={(e) => {
            setTokenAddress(e.target.value);
          }}
        /> */}

        <CreatOfferModal
          show={modalShow}
          onHide={(isSuccess) => onHide(isSuccess)}
        />
      </div>

      <div className="market-body">
        {userActiveoffers.length > 0 && (
          <div className="w-full">
            <h2 className="market-body-head">Your Offers</h2>
            <div className="market-body-content">
              <Table className="market-table">
                <thead>
                  <tr>
                    <th>Offer Contract</th>
                    <th>TOKEN</th>
                    <th>PRICE PER TOKEN</th>
                    <th>
                      TOKEN AMOUNT
                    </th>
                    <th>TOKEN WANTED</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {userActiveoffers.map((offer) => (
                    <Row userContract={true} offer={offer} />
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        )}
        <br />
        <div className="w-full">
          <h2 className="market-body-head">All Locked Token Offers</h2>
          <div className="market-body-content">
            <Table className="market-table">
              <thead>
                <tr>
                  <th>Offer Contract</th>
                  <th>TOKEN</th>
                  <th>PRICE PER TOKEN</th>
                  <th>
                    TOKEN AMOUNT
                  </th>
                  <th>TOKEN WANTED</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {activeoffers.map((offer) => (
                  <Row offer={offer} />
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewMarket;
