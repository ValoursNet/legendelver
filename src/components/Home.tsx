import React from "react";
import {
    Link
} from "react-router-dom";

const Home = () => (
    <>
        <div className="home">
            <div className="menu-container">
                <h1 className="menu-title">Legendelver</h1>
                <div className="col-lg-5">
                    {/*
                    <Link to={"/screen"}>
                        <div className="menu-item">
                            <span className="menu-button">Screen</span>
                        </div>
                    </Link>
                    */}
                    <Link to={"/controller"}>
                        <div className="menu-item">
                            <span className="menu-button">Play</span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    </>
);

export default Home;
