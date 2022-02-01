import React, { useState } from 'react';
import { Button, Card } from 'react-bootstrap';

import ConnectWallet from "../components/ConnectWallet";
import ViewMarket from "../components/ViewMarket";

function Main() {
    // const { active, error, account, library, connector, activate, deactivate, onActivate } = useWeb3React();
    const [ viewMarket, SetViewMarket] = useState(false);
    // const connect = async () => {
    //     console.log("hello");
    //     await activate(injected);
    // }
    return (
        <>
        {
            viewMarket ? <ViewMarket></ViewMarket> :<ConnectWallet viewMarketClick={()=> SetViewMarket(true)}></ConnectWallet>
        }
        </>
        
    )
}

export default Main;
