import { useWeb3React } from "@web3-react/core";
import { Contract } from "ethers-multicall";
import React, { useEffect, useRef, useState } from "react";
import { Button, Dropdown, Table } from "react-bootstrap";
import logo from "../assets/images/foxswap.svg";
import CreatOfferModal from "../components/modal/CreatOfferModal";
import ERC20Token from "../contracts/ERC20Token";
import LockedTokenLens from "../contracts/LockedTokenLens";
import OfferContract from "../contracts/Offer";
import {
  ZERO_ADDRESS,
  contractAddress,
  map as addressToContract, numberWithCommas,
} from "../helper/utils";
import Row from "./Row";
import OfferABI from "../contracts/abi/OfferABI.json";
import { initMultiCall } from "../contracts/multicall";
import OfferFactory from "../contracts/OfferFactory";
import DataTable from "./DataTable";


function filterOfferData(offeresData, sellersAddress, account) {
  if (offeresData.length === 0 || sellersAddress.length === 0) return;
  const userOffer = [];
  for (let i = 0; i < offeresData.length; i++) {
    if (sellersAddress[i].toLowerCase() === account.toLowerCase()) {
      userOffer.push(offeresData[i]);
    }
  }
  return userOffer;
}

function ViewMarket() {
  const [modalShow, setModalShow] = React.useState(false);
  const { library, account } = useWeb3React();
  const [activeoffers, setActiveOffer] = useState([]);
  const [filterActiveoffers, setFilterActiveOffer] = useState([]);
  const [userActiveoffers, setUserActiveOffer] = useState([]);
  const [filterUserActiveoffers, setFilterUserActiveOffer] = useState([]);
  const [totalVolume, setTotalVolume] = useState("");
  const [offeresData, setOffersData] = useState([]);
  const [sellersAddress, setSellersAddress] = useState([]);
  const [sortStatus, setSortStatus] = useState("Show: All");
  const [filterToken, setFilterToken] = useState();

  const fetchTotalVolume = async () => {
    const factory = new OfferFactory(
      contractAddress.offerFactory,
      library.getSigner()
    );
    const totalVolume = await factory.totalVolume();
    setTotalVolume(totalVolume);
  };

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
        const lockedBalance = ERC20Token.getFromWei(data[2][i].toString(), 18);
        // console.log(i, lockedToken, lockedBalance);
        const { decimals: tokenWantedecimal, symbol: tokenWantedSymbol } =
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
    setFilterActiveOffer(activeoffers_local);

    let sellers = activeoffers_local.map((ele) => {
      const contract = new Contract(ele.offerAddresses, OfferABI);
      return contract.seller();
    });
    const callInstance = await initMultiCall();
    const allSellers = await callInstance.all(sellers)
    setSellersAddress(await callInstance.all(sellers));
    const tempUserData = filterOfferData(activeoffers_local, allSellers, account)
    setFilterUserActiveOffer(tempUserData);
    setUserActiveOffer(tempUserData)
  };

  const onHide = (isSuccess = false) => {
    if (isSuccess) fetchData(); fetchTotalVolume();
    setModalShow(false);
  };

  const handleSelect = (e) => {
    const tempUserData = userActiveoffers;
    const activeData = activeoffers;
    setSortStatus(e);
    const filterString = e.split(" ")[1];
    setFilterToken(e.split(" "[1]));
    const filterActiveData = activeData.filter((contract) => {
      if (filterString.toLowerCase() == "All".toLowerCase()) {
        return true;
      } else {
        return contract.lockedToken.name === filterString;
      }
    });

    const filterUserData = tempUserData.filter((contract) => {
      if (filterString.toLowerCase() == "All".toLowerCase()) {
        return true;
      } else {
        return contract.lockedToken.name === filterString;
      }
    });
    setFilterActiveOffer(filterActiveData);
    setFilterUserActiveOffer(filterUserData);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "OFFER CONTRACT",
        id: '1',
        accessor: (d) => <>{d.offerAddresses.slice(0, 8)}...</>,
      },
      {
        Header: "Token",
        id: '2',
        accessor: (d) => d.lockedToken.symbol,
        Cell: ({ row: { original } }) => {
          const imgFile = `images/${original.lockedToken.symbol.toLowerCase()}.png`;
          return <img className="card-image mt-1" src={imgFile} />;
        },
      },
      {
        Header: "PRICE PER TOKEN",
        id: '3',
        accessor: (d) => d.pricePerToken,
        Cell: ({ row: { original } }) => `$${original.pricePerToken}`,
      },
      {
        Header: "TOKEN AMOUNT",
        id: '4',
        accessor: (d) => d.lockedBalances,
        Cell: ({ row: { original } }) => {
          return <>
            {numberWithCommas(original.lockedBalances, false)} <br/> {original.lockedToken.symbol}
          </>
        },
        sortMethod: (a, b) => {
          return Number(a) - Number(b)
        }
      },
      {
        Header: "TOKEN WANTED",
        id: '5',
        accessor: (d) => d.amountWanted,
        Cell: ({ row: { original } }) => {
          return <>
            {numberWithCommas(original.amountWanted, false)} <br/> {original.tokenWantedSymbol}
          </>
        },
        sortMethod: (a, b) => {
          return Number(a) - Number(b)
        }
      },
    ],
    []
  );

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
            <div className="total-volume p-3">
              $ {numberWithCommas(totalVolume, false)}
            </div>
          </div>

          <img className="card-image mt-3" src={logo} />
        </div>
      </div>
      <div className="market-btn-group">
        {/* <input type="button" class="btn btn-primary btn-md rounded-btn capitalize mb-10" value="Create Offer" /> */}
        <Button
          variant="primary"
          className="btn button2 rounded-btn btn-md market-btn"
          value="create offer"
          onClick={() => setModalShow(true)}
        >
          Create Offer
        </Button>

        <Dropdown className="dropdown-btn" onSelect={handleSelect}>
          <Dropdown.Toggle
            className="button padding rounded-btn text-white"
            variant="flat"
            id="dropdown-basic"
          >
            {sortStatus}
          </Dropdown.Toggle>
          <Dropdown.Menu className="bg-base-100">
            <Dropdown.Item
              vallue="all"
              eventKey="Show: ALL"
              className="item"
            >
              All
            </Dropdown.Item>
            <Dropdown.Item eventKey="Filter: JEWEL" className="item">
              JEWEL
            </Dropdown.Item>
            <Dropdown.Item eventKey="Filter: VIPER" className="item">
              VIPER
            </Dropdown.Item>
            {/* <Dropdown.Divider className="border" /> */}
          </Dropdown.Menu>
        </Dropdown>

        <CreatOfferModal
          show={modalShow}
          onHide={(isSuccess) => onHide(isSuccess)}
        />
      </div>

      <div className="market-body">
        {filterUserActiveoffers.length > 0 && (
          <>
            <h2 className="market-body-head">Your Offers</h2>
            <DataTable
              userContract={true}
              columns={columns}
              data={filterUserActiveoffers}
              filter={filterToken}
            />
          </>
        )}
        <h2 className="market-body-head">All Locked Token Offers</h2>
        <DataTable
          columns={columns}
          filter={filterToken}
          data={filterActiveoffers}
        />
      </div>
    </div>
  );
}

export default ViewMarket;
