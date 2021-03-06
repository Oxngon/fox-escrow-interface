import React, { useState } from 'react';
import { Button, Card } from 'react-bootstrap';

import ConnectWallet from "../components/ConnectWallet";
import ViewItemMarket from "../components/ViewItemMarket";

function Main() {
    // const { active, error, account, library, connector, activate, deactivate, onActivate } = useWeb3React();
    const [ viewMarket, SetViewMarket] = useState(false);
    return (
        <>
        {
            viewMarket ? <ViewItemMarket></ViewItemMarket> :<ConnectWallet viewMarketClick={()=> SetViewMarket(true)}></ConnectWallet>
        }
        </>
        
    )
}

export default Main;
