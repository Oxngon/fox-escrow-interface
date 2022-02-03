import React from "react";
import "./index.scss";
import LeftSidebar from "../src/components/LeftSidebar";
import RightSidebar from "../src/components/RightSidebar";
import Main from "../src/components/Main";
import MainItems from "../src/components/MainItems";
import {
    Routes,
    Route
} from "react-router-dom";
import AboutUs from "./components/AboutUs";

function App() {
    return (

        <Routes>
            <Route path="/" element={<>
                  <RightSidebar />
                  <Main />
                </>
            } />
            <Route path="/tokens" element={<>
                <RightSidebar />
                <Main />
            </>
            } />
            <Route path="/about" element={<>
                <RightSidebar />
                <AboutUs />
                </>} />
            <Route path="/items" element={<>
                <RightSidebar />
                <MainItems />
            </>} />
        </Routes>

    );
}

export default App;
