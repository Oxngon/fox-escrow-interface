import { useWeb3React } from "@web3-react/core";
import React, { useState, useEffect } from "react";
import ERC20Token from "../contracts/ERC20Token";
import OfferContract from "../contracts/Offer";
import { Button } from "react-bootstrap";
import logo from "../assets/images/foxswap.svg";
import {getItemImage, ItemType} from "../helper/utils";
import FillOfferModal from "./modal/FillOfferModal";
import ItemOfferContract from "../contracts/ItemOffer";

export default function ItemRow({ offer, userContract }) {
  const [btnText, setBtnText] = useState("Buy");
  const [loading, setLoading] = useState(false);

  const [fillModalShow, setFillModalShow] = React.useState(false);
  const { library } = useWeb3React();
  const [btnCancelText, setbtnCancelText] = useState("Cancel");
  const [cancelLoading, setcancelLoading] = useState(false);

  const onHide = () => {
    setFillModalShow(false);
  };

  useEffect(async () => {
    if (userContract) {
      setBtnText("cancel & withdraw");
    }
  }, []);

  const btnClick = async () => {
    if (userContract) {
      let prevText = btnText;
      try {
        if (btnText === "cancel & withdraw") {
          setLoading(true);
          setBtnText("please wait....");
          const offerContract = new OfferContract(
            offer.offerAddresses,
            library.getSigner()
          );
          await offerContract.cancel();
          setBtnText("Cannceled");
        }
      } catch (err) {
        alert(JSON.stringify(err));
        console.log(err);
        setBtnText(prevText);
      }

      setLoading(false);
    } else {
      setLoading(true);
      let prevText = btnText;
      // setBtnText("please wait....");
      try {
        if (btnText === "Buy") {
          setFillModalShow(true);
        }
      } catch (err) {
        alert(JSON.stringify(err));
        console.log(err);
        setBtnText(prevText);
      }

      setLoading(false);
    }
  };
  return (
    <tr>
      <FillOfferModal
          offer={offer}
          show={fillModalShow}
          onHide={onHide}
      />
      <td>{offer.offerAddresses.slice(0, 8)}...</td>
      {/* <td>{offer.offerAddresses}...</td> */}
      <td><img className="card-image mt-1" src={getItemImage(offer.item)} /></td>
      <td>
        {offer.itemBalances}
        <br /> {offer.item.name}(s)
      </td>
      <td>
        ${offer.pricePerToken} <br /> {offer.tokenWanted.symbol}
      </td>
      <td className="w-28">
        <Button className="table-btn" disable={loading} onClick={btnClick}>
         <div className="content-center">
           {btnText}
          {btnText === "Approve" && (
            <>
              <br /> {offer.tokenWanted.symbol}
            </>
          )}
         </div>
        </Button>
      </td>
      {/* <td className="w-28">
            <Button className="table-btn" disable={cancelLoading} onClick={async () => {
                setcancelLoading(true);
                let prevText = btnCancelText;
                setbtnCancelText('please wait....')
                try{
                    if (btnCancelText === 'Cancel') {
                        const offerContract = new OfferContract(offer.offerAddresses, library.getSigner());
                        await offerContract.cancel();
                        setbtnCancelText('Cannceled');   
                    }
                }catch(err) {
                    alert(JSON.stringify(err));
                    console.log(err);
                    setbtnCancelText(prevText);
                }
             
                setcancelLoading(false);
            }}>  {btnCancelText}
            </Button>
        </td> */}
    </tr>
  );
}
