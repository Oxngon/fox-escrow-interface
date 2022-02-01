import OfferABI from './abi/OfferFactory.json';
import { ethers } from 'ethers';
import { Contract } from 'ethers-multicall';
import { initMultiCall } from './multicall';

export default class OfferFactory {
    constructor(address, provider) {
        this.token = new ethers.Contract(address, OfferABI, provider);
    }    
    
    createOffer = async (lockedTokenAddress, stableCoinAddress, totalAmtStableCoins) => {
        const tx = await this.token.createOffer(lockedTokenAddress, stableCoinAddress, totalAmtStableCoins);   
        return await tx.wait();
    }

}