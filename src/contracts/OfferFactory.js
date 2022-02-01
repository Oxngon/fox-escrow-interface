import OfferABI from './abi/OfferFactory.json';
import { ethers } from 'ethers';
import { Contract } from 'ethers-multicall';
import { initMultiCall } from './multicall';

export default class OfferFactory {
    constructor(address, provider) {
        this.token = new ethers.Contract(address, OfferABI, provider);
        this.contract = new Contract(address, OfferABI);
    }    
    
    createOffer = async (lockedTokenAddress, stableCoinAddress, totalAmtStableCoins) => {
        const tx = await this.token.createOffer(lockedTokenAddress, stableCoinAddress, totalAmtStableCoins);   
        return await tx.wait();
    }

    totalVolume = async () => {
        const callInstance = await initMultiCall();
        const value = await callInstance.all([this.contract.totalVolume()])
        const ans = ethers.utils.formatUnits(value[0], 18);
        return ans;
    }

}