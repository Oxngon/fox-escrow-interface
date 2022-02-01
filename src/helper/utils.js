import { ethers } from "ethers";
import { activeNetwork, networks } from "../config/networkConfig";

export const provider = new ethers.providers.JsonRpcProvider(networks[activeNetwork]);

export const contractAddress = {
    multicallAddress: "0x414597a32aa9ce3e719ffebff9629c819ca4d1b1", // harmony network
    // offerContract: "0xf4f2fDa11599dbaaDf07Ef58b6AC4b7C16666EE1",
    offerFactory:    "0x101aACeF8D4F3f860fa88B77e9cb885d19D2027A",
    lockedTokenLens: "0xb9f47cDBDC30602217e08aBCd771Cc1277Ff3138",
    lockedTokens: [
        { name: "JWEL", address: "0x25FbA88B91f72edc04def5F16B6b6dC4aeC47854", decimals: 18, symbol: "JWL" }
    ],
    stableCoins: [
        { name: "USDC", address: "0xc6a6cd8e4a0134b37e3595dbac6f738970fc01a6", decimals: 18, symbol: "USDC"},
        { name: "BUSD", address: "0x3f9e6d6328d83690d74a75c016d90d7e26a7188c", decimals: 18, symbol: "BUSD"},
        { name: "UST", address: "0xe6fcfd410a993572713c47a3638478288d06ab2d", decimals: 18, symbol: "BUSD"}
    ]
}

export const map = new Map();

contractAddress.lockedTokens.forEach((contract) => map.set(contract.address.toLowerCase(), contract));
contractAddress.stableCoins.forEach((contract) => map.set(contract.address.toLowerCase(), contract));