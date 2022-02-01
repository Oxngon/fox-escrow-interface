import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import store from './store/configStore';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import { BrowserRouter } from "react-router-dom";

function getLibrary(provider) {
    return new ethers.providers.Web3Provider(provider)
  }
ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <Web3ReactProvider getLibrary={getLibrary}>
            <BrowserRouter>
                <App />
               </BrowserRouter>
            </Web3ReactProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
