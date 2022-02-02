import ItemOfferABI from './abi/ItemOfferABI.json';
import { ethers } from 'ethers';
import { Contract } from 'ethers-multicall';
import { initMultiCall } from './multicall';

export default class ItemOfferContract {
    constructor(address, provider) {
        this.token = new ethers.Contract(address, ItemOfferABI, provider);
    }

    fill = async (amount) => {
        let tx = await this.token.fill(amount);
        return await tx.wait();
    }
    cancel = async () => {
        let tx = await this.token.cancel();
        return await tx.wait();
    }

  
}