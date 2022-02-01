import { configureStore } from "@reduxjs/toolkit";
import reducer from './rootReducer';
import { dvxlockerAPI } from "./services/api";

export default configureStore({
    reducer,
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(dvxlockerAPI.middleware)
})