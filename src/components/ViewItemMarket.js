import { useWeb3React } from "@web3-react/core";
import { Contract } from "ethers-multicall";
import React, { useEffect, useRef, useState } from "react";
import { Button, Table } from "react-bootstrap";
import logo from "../assets/images/foxswap.svg";
import ERC20Token from "../contracts/ERC20Token";
import LockedTokenLens from "../contracts/LockedTokenLens";
import {ZERO_ADDRESS, contractAddress, map as addressToContract, numberWithCommas} from "../helper/utils";
import ItemRow from "./ItemRow";
import OfferABI from "../contracts/abi/OfferABI.json";
import { initMultiCall } from "../contracts/multicall";
import OfferFactory from "../contracts/OfferFactory";
import CreateItemOfferModal from "./modal/CreateItemOfferModal";

function ViewMarket() {
  const [itemModalShow, setItemModalShow] = React.useState(false);
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
        // console.log("user offer", offeresData[i]);
        userOffer.push(offeresData[i]);
      }
    }

    setUserActiveOffer(userOffer);
  }, [account, offeresData, sellersAddress]);

  const fetchTotalVolume = async () => {
    const factory = new OfferFactory(
        contractAddress.itemOfferFactory,
        library.getSigner()
    );
    const totalVolume = await factory.totalVolume();
    setTotalVolume(totalVolume);
  }

  const fetchData = async () => {
    const lockedTokenLens = new LockedTokenLens(
      contractAddress.itemLens,
      library.getSigner()
    );
    let data = await lockedTokenLens.getAllActiveOfferInfo(
      contractAddress.itemOfferFactory
    );

    let activeoffers_local = [];
    for (let i = 0; i < data[0].length; i++) {
      if (data[0][i] !== ZERO_ADDRESS) {
        const item = addressToContract.get(data[0][i].toLowerCase());
        const lockedBalance = ERC20Token.getFromWei(data[2][i].toString(), 0);
        const tokenWanted = addressToContract.get(data[3][i].toLowerCase());
        const pricePerToken = ERC20Token.getFromWei(
            data[4][i].toString(),
            tokenWanted.decimals
        );
        activeoffers_local.push({
          offerAddresses: data[1][i],
          itemBalances: lockedBalance.toString(),
          tokenWantedAddress: data[3][i].toLowerCase(),
          pricePerTokenInWei: data[4][i].toString(),
          pricePerToken,
          item,
          tokenWanted,
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
    setItemModalShow(false);
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
            <div className="total-volume p-3">$ {numberWithCommas(totalVolume, false)}</div>
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
          onClick={() => setItemModalShow(true)}
        >
          Create Offer
        </Button>

        <Button className="btn button btn-md rounded-btn market-btn">
          Lowest Price
        </Button>

        <CreateItemOfferModal
          show={itemModalShow}
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
                    <th>ITEM</th>
                    <th>
                      ITEMS AVAILABLE
                    </th>
                    <th>PRICE PER ITEM</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {userActiveoffers.map((offer) => (
                    <ItemRow userContract={true} offer={offer} />
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        )}
        <br />
        <div className="w-full">
          <h2 className="market-body-head">All Item Offers</h2>
          <div className="market-body-content">
            <Table className="market-table">
              <thead>
                <tr>
                  <th>Offer Contract</th>
                  <th>ITEM</th>
                  <th>ITEMS AVAILABLE</th>
                  <th>PRICE PER ITEM</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {activeoffers.map((offer) => (
                  <ItemRow offer={offer} />
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
