import { ethers } from "ethers";
import { activeNetwork, networks } from "../config/networkConfig";

export function numberWithCommas(x, decimals) {
    if (x === '') {return '0'}
    if (decimals) {
        return x.toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    }
    return parseInt(x).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

export const provider = new ethers.providers.JsonRpcProvider(networks[activeNetwork]);

export const ItemType = {
    FISH: "FISH",
    PLANT: "PLANT",
    EGG: "EGG",
    POTION: "POTION",
    RUNE: "RUNE"
}

const contractAddressTestnet = {
    multicallAddress: "0x414597a32aa9ce3e719ffebff9629c819ca4d1b1", // harmony network
    offerFactory:    "0xc12d028Bf980c10d7f3dc89deb8Fa6a92e34a5fd",
    lockedTokenLens: "0x550CBEB65928b5bd66E725b6094cDCE34FA3599C",
    itemOfferFactory: "0x012Ec04f66B2797B543E01dc79Bc1Ec7887c987F",
    itemLens: "0x2854cf639A538dc4B003C3bCdd2ea9F640f9ca38",
    lockedTokens: [
        { name: "JEWEL", address: "0x25Cb9C2720B88E336c374CF24be68D42bA7243A4", decimals: 18, symbol: "JEWEL" },
        { name: "VIPER", address: "0x4d378E5e189f435B3B1879772A2C2A4c76F5eA36", decimals: 18, symbol: "VIPER" }
    ],
    stableCoins: [
        { name: "USDC", address: "0xC6A6cD8E4a0134b37E3595DBac6f738970fC01A6", decimals: 18, symbol: "USDC" },
        { name: "BUSD", address: "0x3F9E6D6328D83690d74a75C016D90D7e26A7188c", decimals: 18, symbol: "BUSD" },
        { name: "UST", address: "0xE6FCfd410a993572713c47a3638478288d06aB2d", decimals: 18, symbol: "UST" }
    ],
    items: [
        { name: "Bloater", symbol: "Bloater", itemType: ItemType.FISH, address: "0x92Ec6BbBbaA21b01c30F1e6fAC7773FB208bfA13" },
        { name: "Golden Egg", symbol: "GoldenEgg", itemType: ItemType.EGG, address: "0xc1E54E68EB6DB74c6756Ba6C1B39332E0d2a1438" }
    ]
}

const contractAddressMainnet = {
    multicallAddress: "0xFE4980f62D708c2A84D3929859Ea226340759320",
    offerFactory:    "",
    lockedTokenLens: "",
    itemOfferFactory: "",
    itemLens: "",
    lockedTokens: [
        { name: "JEWEL", address: "", decimals: 18, symbol: "JEWEL" },
        { name: "VIPER", address: "", decimals: 18, symbol: "VIPER" },
        { name: "BOSS", address: "", decimals: 18, symbol: "BOSS" },
        { name: "LOOT", address: "", decimals: 18, symbol: "LOOT" },
        { name: "MAGIC", address: "", decimals: 18, symbol: "MAGIC" },
        { name: "SONIC", address: "", decimals: 18, symbol: "SONIC" },
    ],
    stableCoins: [
        { name: "USDC", address: "", decimals: 18, symbol: "USDC" },
        { name: "BUSD", address: "", decimals: 18, symbol: "BUSD" },
        { name: "UST", address: "", decimals: 18, symbol: "UST" }
    ],
    items: [
        { name: "Bloater", symbol: "Bloater", itemType: ItemType.FISH, address: "" },
        { name: "Golden Egg", symbol: "GoldenEgg", itemType: ItemType.EGG, address: "" }
    ]
}


export const contractAddress = contractAddressTestnet;

export const map = new Map();

contractAddress.lockedTokens.forEach((contract) => map.set(contract.address.toLowerCase(), contract));
contractAddress.stableCoins.forEach((contract) => map.set(contract.address.toLowerCase(), contract));
contractAddress.items.forEach((contract) => map.set(contract.address.toLowerCase(), contract));
