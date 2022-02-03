import React, { useEffect, useRef, useState } from "react";
import logo from "../../assets/images/foxswap.svg";
import { Button, Modal, Spinner, Row, Col } from "react-bootstrap";
// import { useForm } from "react-hook-form";
import { ethers } from "ethers";
import {contractAddress, numberWithCommas, provider} from "../../helper/utils";
import LockedToken from "../../contracts/LockedToken";
import { useWeb3React } from "@web3-react/core";
import ErrorMSG from "../ErrorMSG";
import OfferFactory from "../../contracts/OfferFactory";
import ERC20Token from "../../contracts/ERC20Token";


function getImage(lockedToken) {
    return `images/${lockedToken.symbol.toLowerCase()}.png`
}

function CreatOfferModal(props) {
    // const { register, handleSubmit, formState: { errors } } = useForm();
    const [tokenAddressERR, setTokenAdddressERR] = useState(false);
    const [balance, setBalance] = useState('');
    const [price, setprice] = useState('');
    const [priceERR, setpriceERR] = useState(false);
    // const [ balance, setBalance] = useState('');
    const { account, library } = useWeb3React();
    const stableCoins = contractAddress.stableCoins;
    const lockedTokens = contractAddress.lockedTokens;
    const [stableCoin, setStableCoin] = useState(stableCoins[0]);
    const [currentLockedToken, setCurrentLockedToken] = useState(lockedTokens[0]);
    const [loadingOffer, setOfferLoading] = useState(false);
    const [offerCreated, setofferCreated] = useState(false);
    const [fundLoading, setFundLoading] = useState(false);
    const offerAddress = useRef('0x');


    const resetState = () => {
        setTokenAdddressERR(false);
        setBalance('');
        setprice('');
        setpriceERR(false);
        setBalance('');
        setStableCoin(stableCoins[0]);
        setCurrentLockedToken(lockedTokens[0]);
        setOfferLoading(false);
        setofferCreated(false);
        setFundLoading(false);
        offerAddress.current = '0x';
    }

    const fundSubmit = async () => {
        if (offerAddress.current === '0x') return;
        setFundLoading(true);
        try {
            const lockedToken = new LockedToken(currentLockedToken, library.getSigner());
            await lockedToken.transferAll(offerAddress.current);
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
        setAndPing(!ethers.utils.isAddress(currentLockedToken.address), setTokenAdddressERR);
        setAndPing(parseFloat(price) <= 0, setpriceERR);
        if (!flag) return;
        setOfferLoading(true);
        try {
            const erc20 = new ERC20Token(stableCoin.address, library.getSigner());
            const decimals = await erc20.getDecimal();
            const amountOfStable = ERC20Token.getTokenBalanceInWei(price * balance, decimals)
            const offerFactory = new OfferFactory(contractAddress.offerFactory, library.getSigner())
            const tx = await offerFactory.createOffer(currentLockedToken.address, stableCoin.address, amountOfStable);
            offerAddress.current = tx.events[0].args[0];
            console.log(offerAddress.current);
            setofferCreated(true);
            fundSubmit();
        } catch (err) {
            alert(JSON.stringify(err));
            console.log(err);
        }
        setOfferLoading(false);
    }

    useEffect(async () => {
        if (!ethers.utils.isAddress(currentLockedToken.address))
            return;

        const lockedToken = new LockedToken(currentLockedToken, library.getSigner());
        const balance = await lockedToken.getDecimalsTotalBalance(account);
        setBalance(balance)
    }, [currentLockedToken, account, library]);
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
                        <div className="offer-coin-div">
                            <div className="offer-coin-div">
                                <div className="mb-1 ms-1 text-center">
                                    <img src={getImage(currentLockedToken)} className="coin-logo-sm coin-inline m-sm-1"></img>
                                    {`     ${currentLockedToken.symbol} balance: ${numberWithCommas(balance)}`}
                                </div>
                            </div>
                        </div>
                        <Row className="offer-coin-div">
                            <Col>
                            <div className="mb-1 ms-1 text-center">Choose Locked Token </div>
                            <div className="set-coin1">
                                {/* <input className="coin-balance" type="text" value={tokenAddress} placeholder="Token Address" onChange={(e) => {
                                    setTokenAdddress(e.target.value);
                                }} /> */}
                                <select disabled={offerCreated} className="coin-balance select-font text-center" onClick={(e) => setCurrentLockedToken(JSON.parse(e.target.value))}>
                                    {lockedTokens.map((ele, idx) => <option key={idx} value={JSON.stringify(ele)}>{ele.symbol}</option>)}
                                </select>
                            </div>
                            {tokenAddressERR && <ErrorMSG msg='Please Enter valid address' />}
                            </Col><Col>

                            <div className="mb-1 ms-1 text-center">Set price per {currentLockedToken.symbol}: </div>
                            <div className="set-coin1">
                                <input disabled={offerCreated} className="coin-balance text-center" type="number" min={1e-2} step={1e-2} value={price} placeholder="Price Per Token" onChange={(e) => {
                                    setprice(e.target.value);
                                }} />
                            </div>
                            {priceERR && <ErrorMSG msg='Please Enter valid price' />}
                            </Col>
                        </Row>
                        <Row className="offer-coin-div">
                            <Col>
                        <div className="mb-1 ml-2 mt-2 text-center">Select Stablecoin</div>
                        <div className="set-coin1">
                            <select disabled={offerCreated} className="coin-balance select-font text-center" onClick={(e) => setStableCoin(JSON.parse(e.target.value))}>
                                {stableCoins.map((ele, idx) => <option key={idx} value={JSON.stringify(ele)}>{ele.symbol}</option>)}
                            </select>
                        </div>
                            </Col>
                            <Col>
                                <Row className="offer-coin-div">
                                <div className="flex flex-col">
                                    <div className="mb-2 pb-3 ml-2 border-primary text-center">
                                        Total Sale: <br /><b>${numberWithCommas(price * balance, true)}  {stableCoin.symbol}</b>
                                    </div>
                                </div>
                                </Row>
                            </Col>
                        </Row>

                        <div className="mt-4 flex content-center justify-center pb-4 border-b">
                            <Button disabled={loadingOffer || offerCreated || balance == 0} className="btn btn-primary mt-1 w-64 btn-error btn-disabled p-3 border-radius" onClick={handleSubmit}>
                                {balance == 0 ?
                                    `You have no ${currentLockedToken.symbol}` :
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
                                Step 2. Fund Contract with ${currentLockedToken.symbol}
                            </div>
                        </div>

                        {offerAddress.current !== '0x' && <div className="pt-4 text-center">
                            <p>Success! Your contract address is: {offerAddress.current}</p>
                        </div>}
                        <div className="pt-4 text-center">
                            <p>You can cancel the contract and recover all your unsold locked ${currentLockedToken.symbol} at any time.</p>
                        </div>
                        <div className="mt-4 flex content-center justify-center pb-4 border-b">
                            <Button disabled={fundLoading || !offerCreated} onClick={fundSubmit} className="btn btn-primary mt-1 w-64 btn-error btn-disabled p-3 border-radius">
                                Fund Contract
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

export default CreatOfferModal;
