import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { abi } from './utils/PunchPortal.json';
import './App.css';

const CONTRACT_ADDRESS = '0xaCEd4c3c1B03948B3cA57E4047a29F8f1491f746';

export default function App() {
  // https://rinkeby.etherscan.io/address/0xaCEd4c3c1B03948B3cA57E4047a29F8f1491f746
  const [currentAccount, setCurrentAccount] = useState('');

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        return alert('Download MetamMsk!');
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const punch = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        return console.log('Ethereum object does not exist!');
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const punchPortalContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        abi,
        signer
      );

      let count = await punchPortalContract.getTotalPunches();
      console.log('Number of punches so far:', count.toNumber());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      const { ethereum } = window;

      if (!ethereum) {
        return console.log("Looks like you don't have metamask installed!");
      }

      // Check if user allowed access to their wallet
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (!accounts.length > 0)
        return console.log('No authorized account found!');

      const account = accounts[0];
      console.log('Found an authorized account:', account);
      setCurrentAccount(account);
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

        {currentAccount ? (
          <button className="waveButton" onClick={punch}>
            Punch Me!
          </button>
        ) : (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet!
          </button>
        )}
      </div>
    </div>
  );
}
