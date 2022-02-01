// import { createSlice } from "@reduxjs/toolkit";
// import { ethers } from 'ethers';
// import { ButtonText } from "../helper/utils";

// let _initialState = {
//     tokenPairState: {
//         isExist: false,
//         isNewProject: false,
//         checkedIdx: 0,
//         projectDetails: {},
//         submitBtn: ButtonText.search
//     },
//     locksettingState: {
//         percBtn: 0,
//         dateBtn: 0,
//         availableBalance: 0
//     },
//     decimal: 0,
//     token1: '0x',
//     smartContractAddress: '',
//     projectName: '',
//     logoURL: '',
//     symbol: '',
//     quantityToLock: 0,
//     unlockDate: '',
//     socialLinks: [
//     ]
// }

// const slice = createSlice({
//     name: 'LPLock',
//     initialState: {
//         ..._initialState
//     },
//     reducers: {
//         setIsPair: (LPLock, action) => {
//             LPLock.token1 = action.payload;
//         },
//         daftTokenPair: (LPLock, action) => {
//             LPLock.smartContractAddress = action.payload.smartContractAddress;
//             LPLock.tokenPairState = { ...action.payload.tokenPairState }
//         },
//         darftLockSetting: (LPLock, action) => {
//             LPLock.symbol = action.payload.symbol;
//             LPLock.quantityToLock = action.payload.quantityToLock;
//             LPLock.unlockDate = action.payload.unlockDate;
//             LPLock.decimal = action.payload.decimal;
//             LPLock.locksettingState = { ...action.payload.locksettingState }
//             // console.log(LPLock.projectName);
//         },
//         resetState: state => _initialState,
//         draftAddNewProject: (LPLock, action) => {
//             LPLock.logoURL = action.payload.logoURL;
//             LPLock.projectName = action.payload.projectName;
//             LPLock.socialLinks = action.payload.socialLinks;
//         }
//     }
// })

// export const { setIsPair, darftLockSetting, draftAddNewProject, daftTokenPair, resetState } = slice.actions;

// export default slice.reducer


// export const getLockDraft = state => {

//     return state.LPLock;
// }