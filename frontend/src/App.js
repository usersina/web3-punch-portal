// import { ethers } from "ethers";
import React, { useEffect } from 'react';
import './App.css';

export default function App() {
  // https://rinkeby.etherscan.io/address/0xaCEd4c3c1B03948B3cA57E4047a29F8f1491f746
  const punch = () => {};

  useEffect(() => {
    const checkIfWalletIsConnected = () => {
      const { ethereum } = window;

      if (!ethereum) {
        return console.log("Looks like you don't have metamask installed!");
      }

      console.log('Ethereum object is here!', ethereum);
    };
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          <span role="img" aria-label="icon">
            👊
          </span>
          Greetings, fighter!
        </div>

        <div className="bio">
          I am the best fighter around and I'm not afraid of taking your best
          punch! Connect your Ethereum wallet and punch me!
        </div>

        <button className="waveButton" onClick={punch}>
          Punch Me!
        </button>
      </div>
    </div>
  );
}
