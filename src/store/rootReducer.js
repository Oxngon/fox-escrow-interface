import { combineReducers } from "redux";
import LPLockReducer from './LPLockSlice';
import { dvxlockerAPI } from "./services/api";
export default combineReducers({
    LPLock: LPLockReducer,
    // [dvxlockerAPI.reducerPath]: dvxlockerAPI.reducer
})