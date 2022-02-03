import ERC20ABI from './abi/ERC20ABI.json';
import { ethers } from 'ethers';
import { Contract } from 'ethers-multicall';
import { initMultiCall } from './multicall';

export default class ERC20Token {
    constructor(address, provider) {
        this.token = new ethers.Contract(address, ERC20ABI, provider);
    }    
    getTokenName = async()=> {
        return await this.token.name();
    }
    getTokenSymbol = async()=> {
        return await this.token.symbol();
    }

    getTokenBalance = async (address)=> {
        return ethers.utils.formatUnits(await this.token.balanceOf(address), await this.getDecimal());
    }
    static getTokenBalanceInWei = (amt, decimal)=> {
        return ethers.utils.parseUnits(`${amt}`, decimal);
    }

    static getFromWei = (amt, decimal)=> {
        return ethers.utils.formatUnits(amt, decimal);
    }

    getAllowance = async (owner, spender)=> {
        return ethers.utils.formatUnits(await this.token.allowance(owner, spender), await this.getDecimal());
    }

    approve = async (to, amt) => {
        let tx = await this.token.approve(to, amt);
        return await tx.wait();
    }

    transfer = async (to, amt) => {
        let tx = await this.token.transfer(to, amt);
        return await tx.wait();
    }

    getDecimal = async () => {
        return (await this.token.decimals()).toString();
    }
    static getTokenInfo = async (address) => {
        const contract = new Contract(address, ERC20ABI);
        const fxns = [ contract.symbol(), contract.totalSupply(), contract.decimals()];
        let callInstance = await initMultiCall();
        return await callInstance.all(fxns);
    }

}