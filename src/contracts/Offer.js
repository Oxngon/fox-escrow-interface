import OfferABI from './abi/OfferABI.json';
import { ethers } from 'ethers';
import { Contract } from 'ethers-multicall';
import { initMultiCall } from './multicall';

export default class OfferContract {
    constructor(address, provider) {
        this.token = new ethers.Contract(address, OfferABI, provider);
    }    
   

    fill = async () => {
        let tx = await this.token.fill();
        return await tx.wait();
    }
    cancel = async () => {
        let tx = await this.token.cancel();
        return await tx.wait();
    }

  
}