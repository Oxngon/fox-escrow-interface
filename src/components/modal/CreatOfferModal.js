import React, { useEffect, useRef, useState } from "react";
import logo from "../../assets/images/foxswap.svg";
import { Button, Modal, Spinner } from "react-bootstrap";
// import { useForm } from "react-hook-form";
import { ethers } from "ethers";
import { contractAddress, provider } from "../../helper/utils";
import LockedToken from "../../contracts/LockedToken";
import { useWeb3React } from "@web3-react/core";
import ErrorMSG from "../ErrorMSG";
import OfferFactory from "../../contracts/OfferFactory";
import ERC20Token from "../../contracts/ERC20Token";

function CreatOfferModal(props) {
    // const { register, handleSubmit, formState: { errors } } = useForm();
    const [tokenAddressERR, setTokenAdddressERR] = useState(false);
    const [balance, setBalance] = useState('');
    const [tokenAmt, setTokenAmt] = useState('');
    const [tokenAmtERR, settokenAmtERR] = useState(false);
    const [price, setprice] = useState('');
    const [priceERR, setpriceERR] = useState(false);
    // const [ balance, setBalance] = useState('');
    const { account, library } = useWeb3React();
    const stableCoins = contractAddress.stableCoins;
    const lockedTokens = contractAddress.lockedTokens;
    const [stableCoin, setStableCoin] = useState(stableCoins[0].address);
    const [currentLockedToken, setCurrentLockedToken] = useState(lockedTokens[0]);
    const [loadingOffer, setOfferLoading] = useState(false);
    const [offerCreated, setofferCreated] = useState(false);
    const [fundLoading, setFundLoading] = useState(false);
    const offerAddress = useRef('0x');


    const resetState = () => {
        setTokenAdddressERR(false);
        setBalance('');
        setTokenAmt('');
        settokenAmtERR(false);
        setprice('');
        setpriceERR(false);
        setBalance('');
        setStableCoin(stableCoins[0].address);
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
        setAndPing(parseFloat(tokenAmt) <= 0, settokenAmtERR);
        setAndPing(parseFloat(price) <= 0, setpriceERR);
        if (!flag) return;
        setOfferLoading(true);
        try {
            const erc20 = new ERC20Token(stableCoin, library.getSigner());
            const decimals = await erc20.getDecimal();
            const amountOfStable = ERC20Token.getTokenBalanceInWei(price * tokenAmt, decimals)
            const offerFactory = new OfferFactory(contractAddress.offerFactory, library.getSigner())
            const tx = await offerFactory.createOffer(currentLockedToken.address, stableCoin, amountOfStable);
            offerAddress.current = tx.events[0].args[0];
            console.log(offerAddress.current);
            setofferCreated(true);
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
                            <div className="mb-1 ms-1">Token Address </div>
                            <div className="set-coin">
                                {/* <input className="coin-balance" type="text" value={tokenAddress} placeholder="Token Address" onChange={(e) => {
                                    setTokenAdddress(e.target.value);
                                }} /> */}
                                <select disabled={offerCreated} className="coin-balance select-font" onClick={(e) => setCurrentLockedToken(JSON.parse(e.target.value))}>
                                    {lockedTokens.map((ele, idx) => <option key={idx} value={JSON.stringify(ele)}>{ele.symbol}- {ele.address}</option>)}
                                </select>
                            </div>
                            {tokenAddressERR && <ErrorMSG msg='Please Enter valid address' />}
                        </div>
                        <div className="offer-coin-div">
                            <div className="mb-1 ms-1">${currentLockedToken.symbol} balance: {balance} </div>
                            <div className="set-coin">
                                <div className="coin-balance">
                                    <img src={logo} className="coin-logo-sm coin-inline m-auto"></img>
                                    <input disabled={offerCreated} className="coin-balance" style={{border: 'none'}} type="number" min={1e-18} step={1e-18} value={tokenAmt} placeholder="Amount" onChange={(e) => {
                                        setTokenAmt(e.target.value);
                                    }} />
                                </div>
                            </div>
                            {tokenAmtERR && <ErrorMSG msg='Please Enter valid amt' />}
                        </div>

                        <div className="offer-coin-div">
                            <div className="mb-1 ms-1">Set ${currentLockedToken.symbol} price: </div>
                            <div className="set-coin">
                                <input disabled={offerCreated} className="coin-balance" type="number" min={1e-18} step={1e-18} value={price} placeholder="Amount" onChange={(e) => {
                                    setprice(e.target.value);
                                }} />
                            </div>
                            {priceERR && <ErrorMSG msg='Please Enter valid price' />}
                        </div>

                        <div className="flex flex-col">
                            <div className="mb-2 pb-3 ml-2 border-b border-primary">
                                Total Sale: ${price * tokenAmt}
                            </div>
                        </div>
                        <div className="mb-1 ml-2 mt-2">Select Stablecoin</div>
                        <div className="set-coin">
                            <select disabled={offerCreated} className="coin-balance select-font" onClick={(e) => setStableCoin(e.target.value)}>
                                {stableCoins.map((ele, idx) => <option key={idx} value={ele.address}>{ele.symbol}- {ele.address}</option>)}
                            </select>
                        </div>
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
                        <div className="pt-4">
                            <p>You can cancel the contract and retrieve all your unsold locked ${currentLockedToken.symbol} at any time.</p>
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
