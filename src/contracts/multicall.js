// import { contractAddress } from "../helper/utils";

import { Contract, Provider } from 'ethers-multicall';
import { ethers } from "ethers";
import { contractAddress } from '../helper/utils';

let ethcallProvider;

export const initMultiCall = async function(){
    if(ethcallProvider)
        return ethcallProvider;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    ethcallProvider = new Provider(provider);
    await ethcallProvider.init();
    ethcallProvider._multicallAddress = contractAddress.multicallAddress;
    return ethcallProvider;
};