import React from "react";
import "../styles/Loader.css";
import Bank from "../assets/Loader.gif"
import BankLoader from "../assets/Skateboarding.gif"

const Loader = () => {
  return (
    <div className="loader-container">
      <div>
        <img src={Bank}></img>
        <img src={BankLoader}></img>
      </div>
      

      
    </div>
  );
};

export default Loader;