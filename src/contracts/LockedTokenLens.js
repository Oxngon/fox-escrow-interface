import LockedTokenLensABI from './abi/LockedTokenLensABI.json';
import { ethers } from 'ethers';
import { Contract } from 'ethers-multicall';
import { initMultiCall } from './multicall';

export default class LockedTokenLens {
    constructor(address, provider) {
        this.token = new ethers.Contract(address, LockedTokenLensABI, provider);
        console.log(this.token);
    } 
  
    getAllActiveOfferInfo = async (offerFactory)=> {
        console.log(offerFactory);
        try{
            return await this.token.getAllActiveOfferInfo(offerFactory);
            
        }catch(err) {
            console.log(err);
        }
    }

    getOfferInfo = async (offerFactory)=> {
        return await this.token.getOfferInfo(offerFactory);
    }
}