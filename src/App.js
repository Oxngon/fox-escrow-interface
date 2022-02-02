import React from "react";
import "./index.scss";
import LeftSidebar from "../src/components/LeftSidebar";
import RightSidebar from "../src/components/RightSidebar";
import Main from "../src/components/Main";
import {
    Routes,
    Route
} from "react-router-dom";
import AboutUs from "./components/AboutUs";

function App() {
    return (

        <Routes>
            <Route path="/" element={<>
                <RightSidebar></RightSidebar>
                <Main /></>} />
            <Route path="/about" element={<AboutUs />} />
        </Routes>

    );
}

export default App;
