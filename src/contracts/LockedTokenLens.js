import LockedTokenLensABI from './abi/LockedTokenLensABI.json';
import { ethers } from 'ethers';
import { Contract } from 'ethers-multicall';
import { initMultiCall } from './multicall';

export default class LockedTokenLens {
    constructor(address, provider) {
        this.contract = new ethers.Contract(address, LockedTokenLensABI, provider);
    } 
  
    getAllActiveOfferInfo = async (offerFactory) => {
        try{
            return await this.contract.getAllActiveOfferInfo(offerFactory);
            
        }catch(err) {
            console.log(err);
        }
    }

    getOfferInfo = async (offerFactory)=> {
        return await this.contract.getOfferInfo(offerFactory);
    }
}