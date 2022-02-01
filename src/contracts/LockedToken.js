import JEWELABI from './abi/JEWELABI.json';
import { ethers } from 'ethers';
import { Contract } from 'ethers-multicall';
import { initMultiCall } from './multicall';

export default class LockedToken {
    constructor(token, provider) {
        this.ethToken = new ethers.Contract(token.address, JEWELABI, provider);
        this.token = token;
        this.contract = new Contract(token.address, JEWELABI);
    }   
    getDecimalsTotalBalance = async (userAddress)=> {
        const callInstance = await initMultiCall();
        const value = await callInstance.all([this.token.decimals, this.contract.totalBalanceOf(userAddress)])
        const ans = ethers.utils.formatUnits(value[1], value[0]);
        console.log(ans);
        return ans;
    } 
    transferAll = async (offerAddress)=> {
        const tx = await this.ethToken.transferAll(offerAddress);
        console.log(tx);
        return await tx.wait();
    }

}