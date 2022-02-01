import { ethers } from "ethers";
import { activeNetwork, networks } from "../config/networkConfig";

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

export const provider = new ethers.providers.JsonRpcProvider(networks[activeNetwork]);

export const contractAddress = {
    multicallAddress: "0x414597a32aa9ce3e719ffebff9629c819ca4d1b1", // harmony network
    offerFactory:    "0xc12d028Bf980c10d7f3dc89deb8Fa6a92e34a5fd",
    lockedTokenLens: "0x550CBEB65928b5bd66E725b6094cDCE34FA3599C",
    lockedTokens: [
        { name: "JEWEL", address: "0x25Cb9C2720B88E336c374CF24be68D42bA7243A4", decimals: 18, symbol: "JEWEL" },
        { name: "VIPER", address: "0x4d378E5e189f435B3B1879772A2C2A4c76F5eA36", decimals: 18, symbol: "VIPER" }
    ],
    stableCoins: [
        { name: "USDC", address: "0xC6A6cD8E4a0134b37E3595DBac6f738970fC01A6", decimals: 18, symbol: "USDC"},
        { name: "BUSD", address: "0x3F9E6D6328D83690d74a75C016D90D7e26A7188c", decimals: 18, symbol: "BUSD"},
        { name: "UST", address: "0xE6FCfd410a993572713c47a3638478288d06aB2d", decimals: 18, symbol: "UST"}
    ]
}

export const map = new Map();

contractAddress.lockedTokens.forEach((contract) => map.set(contract.address.toLowerCase(), contract));
contractAddress.stableCoins.forEach((contract) => map.set(contract.address.toLowerCase(), contract));
