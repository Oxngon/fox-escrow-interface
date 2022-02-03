import { ethers } from "ethers";
import { activeNetwork, networks } from "../config/networkConfig";

export function numberWithCommas(x, decimals) {
    if (x === '') {return '0'}
    if (decimals) {
        return x.toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    }
    return parseInt(x).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}


export function getItemImage(item) {
    if (item.symbol === "goldenegg") {
        return `images/${item.symbol.toLowerCase()}.gif`
    }
    return `images/${item.symbol.toLowerCase()}.png`
}

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

export const provider = new ethers.providers.JsonRpcProvider(networks[activeNetwork]);

export const ItemType = {
    FISH: "FISH",
    OTHER: "OTHER",
    EGG: "EGG",
    PLANT: "PLANT",
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
        { name: "Blue Egg", symbol: "blueegg", itemType: ItemType.EGG, address: "0xc1E54E68EB6DB74c6756Ba6C1B39332E0d2a1438" },
        { name: "Green Egg", symbol: "greenegg", itemType: ItemType.EGG, address: "0xc1E54E68EB6DB74c6756Ba6C1B39332E0d2a1438" },
        { name: "Grey Egg", symbol: "greyegg", itemType: ItemType.EGG, address: "0xc1E54E68EB6DB74c6756Ba6C1B39332E0d2a1438" },
        { name: "Yellow Egg", symbol: "yellowegg", itemType: ItemType.EGG, address: "0xc1E54E68EB6DB74c6756Ba6C1B39332E0d2a1438" },
        { name: "Golden Egg", symbol: "goldenegg", itemType: ItemType.EGG, address: "0xc1E54E68EB6DB74c6756Ba6C1B39332E0d2a1438" }
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
        // Fish
        { name: "Bloater", symbol: "bloater", itemType: ItemType.FISH, address: "0x78aED65A2Cc40C7D8B0dF1554Da60b38AD351432" },
        { name: "Ironscale", symbol: "ironscale", itemType: ItemType.FISH, address: "0xe4Cfee5bF05CeF3418DA74CFB89727D8E4fEE9FA" },
        { name: "Lantern Eye", symbol: "laterneye", itemType: ItemType.FISH, address: "0x8Bf4A0888451C6b5412bCaD3D9dA3DCf5c6CA7BE" },
        { name: "Redgill", symbol: "redgill", itemType: ItemType.FISH, address: "0xc5891912718ccFFcC9732D1942cCD98d5934C2e1" },
        { name: "Sailfish", symbol: "sailfish", itemType: ItemType.FISH, address: "0xb80A07e13240C31ec6dc0B5D72Af79d461dA3A70" },
        { name: "ShimmerSkin", symbol: "shimmerskin", itemType: ItemType.FISH, address: "0x372CaF681353758f985597A35266f7b330a2A44D" },
        { name: "Silverfin", symbol: "silverfin", itemType: ItemType.FISH, address: "0x2493cfDAcc0f9c07240B5B1C4BE08c62b8eEff69" },
        // Other
        { name: "Gaia's Tears", symbol: "gaiastears", itemType: ItemType.OTHER, address: "0x24eA0D436d3c2602fbfEfBe6a16bBc304C963D04" },
        { name: "Gold", symbol: "gold", itemType: ItemType.OTHER, address: "0x3a4EDcf3312f44EF027acfd8c21382a5259936e7" },
        // EGG
        { name: "Blue Egg", symbol: "blueegg", itemType: ItemType.EGG, address: "0x9678518e04Fe02FB30b55e2D0e554E26306d0892" },
        { name: "Golden Egg", symbol: "goldenegg", itemType: ItemType.EGG, address: "0x9edb3Da18be4B03857f3d39F83e5C6AAD67bc148" },
        { name: "Green Egg", symbol: "greenegg", itemType: ItemType.EGG, address: "0x6d605303e9Ac53C59A3Da1ecE36C9660c7A71da5" },
        { name: "Grey Egg", symbol: "greyegg", itemType: ItemType.EGG, address: "0x95d02C1Dc58F05A015275eB49E107137D9Ee81Dc" },
        { name: "Yellow Egg", symbol: "yellowegg", itemType: ItemType.EGG, address: "0x3dB1fd0Ad479A46216919758144FD15A21C3e93c" },
        // Plant
        { name: "Ambertaffy", symbol: "ambertaffy", itemType: ItemType.PLANT, address: "0x6e1bC01Cc52D165B357c42042cF608159A2B81c1" },
        { name: "Bluestem", symbol: "bluestem", itemType: ItemType.PLANT, address: "0xAC5c49Ff7E813dE1947DC74bbb1720c353079ac9" },
        { name: "Darkweed", symbol: "darkweed", itemType: ItemType.PLANT, address: "0x68EA4640C5ce6cC0c9A1F17B7b882cB1cBEACcd7" },
        { name: "Goldvein", symbol: "goldvein", itemType: ItemType.PLANT, address: "0x600541aD6Ce0a8b5dae68f086D46361534D20E80" },
        { name: "Milkweed", symbol: "milkweed", itemType: ItemType.PLANT, address: "0xc0214b37FCD01511E6283Af5423CF24C96BB9808" },
        { name: "Ragweed", symbol: "ragweed", itemType: ItemType.PLANT, address: "0x043F9bd9Bb17dFc90dE3D416422695Dd8fa44486" },
        { name: "Redleaf", symbol: "redleaf", itemType: ItemType.PLANT, address: "0x094243DfABfBB3E6F71814618ace53f07362a84c" },
        { name: "Rockroot", symbol: "rockroot", itemType: ItemType.PLANT, address: "0x6B10Ad6E3b99090De20bF9f95F960addC35eF3E2" },
        { name: "Spiderfruit", symbol: "spiderfruit", itemType: ItemType.PLANT, address: "0x19B9F05cdE7A61ab7aae5b0ed91aA62FF51CF881" },
        { name: "Swift-Thistle", symbol: "swiftthistle", itemType: ItemType.PLANT, address: "0xCdfFe898E687E941b124dfB7d24983266492eF1d" },
        // Potion
        { name: "Anti-Blind Potion", symbol: "antiblindpotion", itemType: ItemType.POTION, address: "0x1771dEc8D9A29F30d82443dE0a69e7b6824e2F53" },
        { name: "Anti-Poison Potion", symbol: "antipoisonpotion", itemType: ItemType.POTION, address: "0xA1f8b0E88c51a45E152934686270DDF4E3356278" },
        { name: "Full Health Potion", symbol: "fullhealthpotion", itemType: ItemType.POTION, address: "0x87361363A75c9A6303ce813D0B2656c34B68FF52" },
        { name: "Health Potion", symbol: "healthpotion", itemType: ItemType.POTION, address: "0x2789F04d22a845dC854145d3c289240517f2BcF0" },
        { name: "Magic Resistance Potion", symbol: "magicresistancepotion", itemType: ItemType.POTION, address: "0x7e120334D9AFFc0982719A4eacC045F78BF41C68" },
        { name: "Full Mana Potion", symbol: "fullmanapotion", itemType: ItemType.POTION, address: "0xDc2C698aF26Ff935cD1c50Eef3a4A933C62AF18D" },
        { name: "Mana Potion", symbol: "manapotion", itemType: ItemType.POTION, address: "0x19b020001AB0C12Ffa93e1FDeF90c7C37C8C71ef" },
        { name: "Stamina Potion", symbol: "staminapotion", itemType: ItemType.POTION, address: "0x959ba19508827d1ed2333B1b503Bd5ab006C710e" },
        { name: "Swiftness Potion", symbol: "swiftnesspotion", itemType: ItemType.POTION, address: "0x872dD1595544CE22ad1e0174449C7ECE6F0bb01b" },
        { name: "Toughness Potion", symbol: "toughnesspotion", itemType: ItemType.POTION, address: "0xFb03c364969a0bB572Ce62b8Cd616A7DDEb4c09A" },
        // Rune
        { name: "Shvas rune", symbol: "shvasrune", itemType: ItemType.RUNE, address: "0x66F5BfD910cd83d3766c4B39d13730C911b2D286" }
    ]
}


export const contractAddress = contractAddressTestnet;

export const map = new Map();

contractAddress.lockedTokens.forEach((contract) => map.set(contract.address.toLowerCase(), contract));
contractAddress.stableCoins.forEach((contract) => map.set(contract.address.toLowerCase(), contract));
contractAddress.items.forEach((contract) => map.set(contract.address.toLowerCase(), contract));
