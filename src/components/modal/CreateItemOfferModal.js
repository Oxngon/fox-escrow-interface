import React, { useEffect, useRef, useState } from "react";
import logo from "../../assets/images/foxswap.svg";
import { Button, Modal, Spinner, Row, Col } from "react-bootstrap";
// import { useForm } from "react-hook-form";
import { ethers } from "ethers";
import {getItemImage, contractAddress, numberWithCommas, provider} from "../../helper/utils";
import { useWeb3React } from "@web3-react/core";
import ErrorMSG from "../ErrorMSG";
import OfferFactory from "../../contracts/OfferFactory";
import ERC20Token from "../../contracts/ERC20Token";


function CreatItemOfferModal(props) {
    // const { register, handleSubmit, formState: { errors } } = useForm();
    const [tokenAddressERR, setTokenAdddressERR] = useState(false);
    const [balance, setBalance] = useState(0);
    const [price, setprice] = useState('');
    const [priceERR, setpriceERR] = useState(false);
    const { account, library } = useWeb3React();
    const stableCoins = contractAddress.stableCoins;
    const items = contractAddress.items;
    const [stableCoin, setStableCoin] = useState(stableCoins[0]);
    const [currentItem, setCurrentItem] = useState(items[0]);
    const [currentAmount, setCurrentAmount] = useState(0);
    const [loadingOffer, setOfferLoading] = useState(false);
    const [offerCreated, setofferCreated] = useState(false);
    const [fundLoading, setFundLoading] = useState(false);
    const offerAddress = useRef('0x');


    const resetState = () => {
        setTokenAdddressERR(false);
        setBalance(0);
        setprice('');
        setpriceERR(false);
        setCurrentAmount(1);
        setStableCoin(stableCoins[0]);
        setCurrentItem(items[0]);
        setOfferLoading(false);
        setofferCreated(false);
        setFundLoading(false);
        offerAddress.current = '0x';
    }

    const fundSubmit = async () => {
        if (offerAddress.current === '0x') return;
        setFundLoading(true);
        try {
            const amountToSend = currentAmount > balance ? balance : currentAmount
            const itemContract = new ERC20Token(currentItem.address, library.getSigner());
            await itemContract.transfer(offerAddress.current, amountToSend);
            resetState();
            props.onHide(true);
        } catch (err) {
            alert(JSON.stringify(err));
            console.log(err);
        }
        setFundLoading(false);
    }

    const handleSubmit = async () => {
        if (balance <= 0) return;
        let flag = true;

        const setAndPing = (result, set) => {
            result ? set(true) : set(false);
            if (result)
                flag = false;
            return !result
        }
        setAndPing(!ethers.utils.isAddress(currentItem.address), setTokenAdddressERR);
        setAndPing(parseFloat(price) <= 0, setpriceERR);
        if (!flag) return;
        setOfferLoading(true);
        try {
            const erc20 = new ERC20Token(stableCoin.address, library.getSigner());
            const decimals = await erc20.getDecimal();
            const pricePerItem = ERC20Token.getTokenBalanceInWei(price, decimals)
            const offerFactory = new OfferFactory(contractAddress.itemOfferFactory, library.getSigner())
            const tx = await offerFactory.createOffer(currentItem.address, stableCoin.address, pricePerItem);
            offerAddress.current = tx.events[0].args[0];
            console.log('New Offer Address:', offerAddress.current);
            setofferCreated(true);
            fundSubmit();
        } catch (err) {
            alert(JSON.stringify(err));
            console.log(err);
        }
        setOfferLoading(false);
    }

    useEffect(async () => {
        if (!ethers.utils.isAddress(currentItem.address))
            return;

        const itemContract = new ERC20Token(currentItem.address, library.getSigner());
        const balance = await itemContract.getTokenBalance(account);
        setBalance(balance)
    }, [currentItem, account, library]);
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
                        Step 1. Deploy Offer Contract
                    </Modal.Title>

                    <form>
                        <Row>
                            <div className="offer-coin-div">
                                <div className="mb-1 ms-1 text-center">
                                    <img src={getItemImage(currentItem)} className="coin-logo-md coin-inline m-sm-1"></img>
                                    {`     ${currentItem.name} balance:`} <b>{numberWithCommas(balance)}</b>{` `}
                                    <img src={getItemImage(currentItem)} className="coin-logo-md coin-inline m-sm-1"></img>
                                </div>
                            </div>
                        </Row>

                            <Row>
                                <Col xs={6}>
                            <div className="mb-1 ms-1 text-center">Choose Item to Sell </div>
                            <div className="set-coin1">
                                {/* <input className="coin-balance" type="text" value={tokenAddress} placeholder="Token Address" onChange={(e) => {
                                    setTokenAdddress(e.target.value);
                                }} /> */}
                                <select disabled={offerCreated} className="coin-balance select-font text-center" onClick={(e) => setCurrentItem(JSON.parse(e.target.value))}>
                                    {items.map((ele, idx) => <option key={idx} value={JSON.stringify(ele)}>{ele.name}</option>)}
                                </select>
                            </div>
                            {tokenAddressERR && <ErrorMSG msg='Please Enter valid address' />}
                                </Col>
                                <Col xs={6}>
                                    <div className="mb-1 ms-1 text-center">Set price per {currentItem.name}: </div>
                                    <div className="set-coin1">
                                        <input disabled={offerCreated} className="coin-balance text-center" type="number" min={1e-2} step={1e-2} value={price} placeholder="Price" onChange={(e) => {
                                            setprice(e.target.value);
                                        }} />
                                    </div>
                                    {priceERR && <ErrorMSG msg='Please Enter valid price' />}
                                </Col>
                        </Row>
                        <Row className="offer-coin-div">
                            <Col>
                            <div className="mb-1 ms-1 text-center"># Items to Sell </div>
                            <div className="set-coin1">
                                <input disabled={offerCreated} className="coin-balance text-center" type="number" min={1} step={1} value={currentAmount} placeholder="Amount" onChange={(e) => {
                                    setCurrentAmount(e.target.value);
                                }} />
                            </div>
                            {priceERR && <ErrorMSG msg='Please Enter valid price' />}
                            </Col>
                            <Col>

                        <div className="mb-1 ms-1 text-center">Select Stablecoin</div>
                        <div className="set-coin1">
                            <select disabled={offerCreated} className="coin-balance select-font text-center" onClick={(e) => setStableCoin(JSON.parse(e.target.value))}>
                                {stableCoins.map((ele, idx) => <option key={idx} value={JSON.stringify(ele)}>{ele.symbol}</option>)}
                            </select>
                        </div>
                            </Col>
                        </Row>
                        <Row>
                            <div className="flex flex-col">
                                <div className="mb-2 pb-3 ml-2 border-primary text-center">
                                    Total Sale: <b>${numberWithCommas(price * currentAmount, true)} {stableCoin.symbol}</b>
                                </div>
                            </div>
                        </Row>
                        <div className="mt-4 flex content-center justify-center pb-4 border-b">
                            <Button
                                disabled={loadingOffer || offerCreated || balance == 0 || currentAmount <= 0 || currentAmount > balance || price <= 0}
                                className="btn btn-primary mt-1 w-64 btn-error btn-disabled p-3 border-radius"
                                onClick={handleSubmit}>
                                {balance == 0 ? `You have no ${currentItem.name}s` :
                                    currentAmount > balance ? `Not enough ${currentItem.name}s` :
                                    `Create Offer`
                                }
                            </Button>
                            {
                                loadingOffer &&
                                <Spinner animation="border" role="status" className="my-auto ms-2">
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                            }
                        </div>
                        <div className="flex justify-content text-center mt-2 border-b pb-3 content-center grid justify-self-center overflow-hidden text-center">
                            <div className="dropdown dropdown-right dropdown-end text-2xl pb-2">
                                Step 2. Fund Contract with {currentItem.name}s
                            </div>
                        </div>
                        {offerAddress.current !== '0x' && <div className="pt-4 text-center">
                            <p>Success! Your contract is <b>{offerAddress.current}</b></p>
                        </div>}
                        <div className="pt-4 text-center">
                            <p>You can cancel the contract and recover all your unsold {currentItem.name}s at any time.</p>
                        </div>
                        <div className="mt-4 flex content-center justify-center pb-4 border-b">
                            <Button disabled={fundLoading || !offerCreated} onClick={fundSubmit} className="btn btn-primary mt-1 w-64 btn-error btn-disabled p-3 border-radius">
                                Send Contract {currentAmount} {currentItem.name}s
                            </Button>
                            {
                                fundLoading &&
                                <Spinner animation="border" role="status" className="my-auto ms-2">
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                            }
                        </div>
                    </form>
                </Modal.Body>
            </div>
        </Modal>
    );
}

export default CreatItemOfferModal;
