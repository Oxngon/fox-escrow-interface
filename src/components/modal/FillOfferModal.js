import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import {getItemImage, ItemType, numberWithCommas, provider} from "../../helper/utils";
import LockedToken from "../../contracts/LockedToken";
import { useWeb3React } from "@web3-react/core";
import ERC20Token from "../../contracts/ERC20Token";
import ItemOfferContract from "../../contracts/ItemOffer";
import OfferContract from "../../contracts/Offer";


function FillOfferModal(props) {
    // const { register, handleSubmit, formState: { errors } } = useForm();
    const [btnText, setBtnText] = useState("Buy");
    const [loading, setLoading] = useState(false);
    const [approvalAmount, setApprovalAmount] = useState('');
    const [amount, setAmount] = useState('');
    const [ balance, setBalance] = useState('');
    const { account, library } = useWeb3React();
    const [loadingOffer, setOfferLoading] = useState(false);
    const [offerCreated, setofferCreated] = useState(false);
    const [fundLoading, setFundLoading] = useState(false);
    const offerAddress = useRef('0x');


    const resetState = () => {
        setAmount('');
        setBalance('');
        setOfferLoading(false);
        setofferCreated(false);
        setFundLoading(false);
        offerAddress.current = '0x';
    }

    const btnClick = async () => {
        if (amount <= 0) return;
        setLoading(true);
        let prevText = btnText;
        setBtnText("please wait....");
        try {
            if (btnText === "Buy") {
                const offerContract = new ItemOfferContract(
                    props.offer.offerAddresses,
                    library.getSigner()
                );
                console.log('fill', props.offer.offerAddresses, amount)
                await offerContract.fill(amount);
                resetState();
                props.onHide(true);
            } else if (btnText === "Approve") {
                const erc20 = new ERC20Token(props.offer.tokenWantedAddress, library.getSigner());
                await erc20.approve(props.offer.offerAddresses, "100000000000000000000000000000000");
                setBtnText("Buy");
            }
        } catch (err) {
            alert(JSON.stringify(err));
            console.log(err);
            setBtnText(prevText);
        }

        setLoading(false);
    };

    useEffect(async () => {
        if (props.show) {
            const stableCoin = new ERC20Token(props.offer.tokenWantedAddress, library.getSigner());
            const bal = await stableCoin.getTokenBalance(account);
            const approvalAmt = await stableCoin.getAllowance(account, props.offer.offerAddresses);
            setBalance(Number(bal));
            setApprovalAmount(approvalAmt);
            if (approvalAmt > 0) {
                setBtnText("Buy");
            } else {
                setBtnText("Approve");
            }
        }
    }, [props, account, library]);
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <div className="offer-modal pt-0">
                <Modal.Header closeButton className="offer-modal-header"></Modal.Header>
                <Modal.Body className="offer-modal-body">
                    <Modal.Title className="offer-modal-title">
                        Buy {props.offer.item.name}s
                    </Modal.Title>

                    <form>

                        <div className="offer-coin-div text-center">
                            <div className="mb-1 ms-1 text-center">
                                Offer Contract Address: <b>{(props.offer.offerAddresses)}</b>
                            </div>
                        </div>
                        <div className="offer-coin-div">
                            <div className="mb-1 ms-1 text-center">
                                <img src={getItemImage(props.offer.item)} className="coin-logo-md coin-inline m-sm-1"></img>
                                {`     ${props.offer.item.name}s for sale:`} <b>{props.offer.itemBalances}</b>{` `}
                                <img src={getItemImage(props.offer.item)} className="coin-logo-md coin-inline m-sm-1"></img>
                            </div>
                        </div>
                        <div className="offer-coin-div text-center">
                            <div className="mb-1 ms-1 text-center">
                                Price Per {props.offer.item.name}: <b>${numberWithCommas(props.offer.pricePerToken)}</b>
                            </div>
                        </div>

                        <div className="offer-coin-div">
                            <div className="mb-1 ms-1 text-center">Amount to buy: </div>
                            <div className="set-coin text-center">
                                <input disabled={offerCreated} className="coin-balance text-center" type="number" min={1} step={1} value={amount} placeholder="Items to Buy" onChange={(e) => {
                                    if (e.target.value > props.offer.itemBalances) {setAmount(props.offer.itemBalances);} else {setAmount(e.target.value);}
                                }} />
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <div className="mb-2 pb-3 ml-2 border-b border-primary text-center">
                                <div>
                                Total Sale ({props.offer.tokenWanted.symbol}): <b>${numberWithCommas(props.offer.pricePerToken * amount, true)}</b>
                                </div>
                                <div>
                                    {props.offer.tokenWanted.symbol} In Wallet: <b>${numberWithCommas(balance, true)}</b>
                                </div>
                            </div>
                        </div>

                        {props.offer.pricePerToken * amount > balance && <div className="offer-coin-div text-error text-center">
                            Insufficient {props.offer.tokenWanted.symbol} balance
                        </div>}
                        <div className="mt-4 flex content-center justify-center pb-4 border-b">
                            <div className="mb-1 ms-1">
                                <Button disabled={fundLoading || props.offer.pricePerToken * amount > balance} onClick={btnClick} className="btn btn-primary mt-1 w-64 btn-disabled p-3 border-radius">
                                    {btnText}
                                </Button>
                                {
                                    fundLoading &&
                                    <Spinner animation="border" role="status" className="my-auto ms-2">
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                }
                            </div>
                        </div>
                    </form>
                </Modal.Body>
            </div>
        </Modal>
    );
}

export default FillOfferModal;
