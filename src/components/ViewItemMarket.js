import { useWeb3React } from "@web3-react/core";
import { Contract } from "ethers-multicall";
import React, { useEffect, useRef, useState } from "react";
import {Button, Dropdown, Table} from "react-bootstrap";
import logo from "../assets/images/foxswap.svg";
import ERC20Token from "../contracts/ERC20Token";
import LockedTokenLens from "../contracts/LockedTokenLens";
import {ZERO_ADDRESS, contractAddress, map as addressToContract, numberWithCommas, getItemImage} from "../helper/utils";
import ItemRow from "./ItemRow";
import OfferABI from "../contracts/abi/OfferABI.json";
import { initMultiCall } from "../contracts/multicall";
import OfferFactory from "../contracts/OfferFactory";
import CreateItemOfferModal from "./modal/CreateItemOfferModal";
import ItemDataTable from "./ItemDataTable";

const value_sort = obj => {
  const sortedKeys = Object.keys(obj).sort((a, b) => obj[a] - obj[b]).reverse();
  const output = {};
  sortedKeys.map(k => output[k] = obj[k]);
  return output;
}

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

function ViewItemMarket() {
  const [itemModalShow, setItemModalShow] = React.useState(false);
  const { library, account } = useWeb3React();
  const [activeoffers, setActiveOffer] = useState([]);
  const [userActiveoffers, setUserActiveOffer] = useState([]);
  const [totalVolume, setTotalVolume] = useState('');
  const [offeresData, setOffersData] = useState([]);
  const [sellersAddress, setSellersAddress] = useState([]);
  // Filters
  const [filterActiveoffers, setFilterActiveOffer] = useState([]);
  const [filterUserActiveoffers, setFilterUserActiveOffer] = useState([]);
  const [sortStatus, setSortStatus] = useState("All Items");
  const [filterToken, setFilterToken] = useState();

  const initialCounts = {}
  contractAddress.items.map(row => (
      initialCounts[row.name] = 0
  ));

  const [itemCount, setItemCount] = useState(initialCounts)

  function incrementCount(itemCount, itemName) {
    const temp = itemCount;
    temp[itemName] = temp[itemName]+ 1
    const tempSorted = value_sort(temp);
    setItemCount(tempSorted);
  }

  React.useMemo(() => {
    if (offeresData.length === 0 || sellersAddress.length === 0) return;

    const userOffer = [];
    for (let i = 0; i < offeresData.length; i++) {
      if (sellersAddress[i].toLowerCase() === account.toLowerCase()) {
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
        incrementCount(itemCount, item.name);
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
    setFilterActiveOffer(activeoffers_local);
    setFilterUserActiveOffer(filterOfferData(activeoffers_local));

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


  const handleSelect = (e) => {
    const tempUserData = userActiveoffers;
    const activeData = activeoffers;
    setSortStatus(e);
    const filterString = e;
    setFilterToken(e);
    const filterActiveData = activeData.filter((contract) => {
      if (filterString.toLowerCase() == "All Items".toLowerCase()) {
        return true;
      } else {
        return contract.item.name === filterString;
      }
    });

    const filterUserData = tempUserData.filter((contract) => {
      if (filterString.toLowerCase() == "All Items".toLowerCase()) {
        return true;
      } else {
        return contract.item.name === filterString;
      }
    });
    setFilterActiveOffer(filterActiveData);
    setFilterUserActiveOffer(filterUserData);
  };

  const columns = React.useMemo(
      () => [
        {
          Header: "OFFER CONTRACT",
          accessor: (d) => <>{d.offerAddresses.slice(0, 10)}...</>,
        },
        {
          Header: "ITEM",
          accessor: (d) => {
            return <img className="card-image mt-1" src={getItemImage(d.item)} />;
          },
        },
        {
          Header: "ITEMS AVAILABLE",
          accessor: (d) => (
            <>
              {d.itemBalances}
            <br /> {d.item.name}(s)
            </>
          )
        },
        {
          Header: "PRICE PER ITEM",
          accessor: (d) => (<>
              ${d.pricePerToken} <br /> {d.tokenWanted.symbol}
              </>
          ),
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
                value="all"
                eventKey="All Items"
                className="item"
            >
              All Items
            </Dropdown.Item>
            {Object.entries(itemCount).map(([k,v])=>
                <Dropdown.Item eventKey={k} className="item">
                  {k} ({v})
                </Dropdown.Item>)
            }
            {/* <Dropdown.Divider className="border" /> */}
          </Dropdown.Menu>
        </Dropdown>

        <CreateItemOfferModal
          show={itemModalShow}
          onHide={(isSuccess) => onHide(isSuccess)}
        />
      </div>

      <div className="market-body">
        {userActiveoffers.length > 0 && (
            <>
              <h2 className="market-body-head">Your Offers</h2>
              <ItemDataTable
                  userContract={true}
                  columns={columns}
                  data={filterUserActiveoffers}
                  filter={filterToken}
              />
            </>
        )}
        <h2 className="market-body-head">All Locked Token Offers</h2>
        <ItemDataTable
            columns={columns}
            filter={filterToken}
            data={filterActiveoffers}
        />
      </div>
    </div>
  );
}

export default ViewItemMarket;
