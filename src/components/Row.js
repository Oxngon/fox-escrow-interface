import { useWeb3React } from "@web3-react/core";
import React, { useState, useEffect } from "react";
import ERC20Token from "../contracts/ERC20Token";
import OfferContract from "../contracts/Offer";
import { Button } from "react-bootstrap";

export default function Row({ offer, userContract }) {
  const [btnText, setBtnText] = useState("Approve");
  const [loading, setLoading] = useState(false);
  const { library } = useWeb3React();
  const [btnCancelText, setbtnCancelText] = useState("Cancel");
  const [cancelLoading, setcancelLoading] = useState(false);

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
      setBtnText("please wait....");
      try {
        if (btnText === "Fill") {
          const offerContract = new OfferContract(
            offer.offerAddresses,
            library.getSigner()
          );
          await offerContract.fill();
          setBtnText("Complete");
        } else if (btnText === "Approve") {
          console.log(offer.stableCoin, offer.amountWantedInWei);
          const erc20 = new ERC20Token(offer.stableCoin, library.getSigner());
          await erc20.approve(offer.offerAddresses, offer.amountWantedInWei);
          setBtnText("Fill");
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
      <td>{offer.offerAddresses.slice(0, 8)}...</td>
      {/* <td>{offer.offerAddresses}...</td> */}
      <td>{offer.pricePerToken}</td>
      <td>
        {offer.lockedBalances}
        <br /> {offer.lockedSymbol}
      </td>
      <td>
        {offer.amountWanted} <br /> {offer.tokenWantedSymbol}
      </td>
      <td className="w-28">
        <Button className="table-btn" disable={loading} onClick={btnClick}>
          {" "}
          {btnText}{" "}
          {btnText === "Approve" && (
            <>
              <br /> {offer.tokenWantedSymbol}
            </>
          )}
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
