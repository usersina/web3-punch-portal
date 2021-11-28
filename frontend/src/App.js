import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { abi } from './utils/PunchPortal.json';
import './App.css';

const CONTRACT_ADDRESS = '0x71b275aafaF9A83DD713086B9FC48D604E036f8a';

export default function App() {
  const [currentAccount, setCurrentAccount] = useState('');

  const [allPunches, setAllPunches] = useState([]);
  const [totalPunches, setTotalPunches] = useState(0);
  const [punching, setPunching] = useState(false);

  const [message, setMessage] = useState('');

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        return alert('Download Metamask!');
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      console.log('Connected', accounts[0]);

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const punchPortalContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        abi,
        signer
      );

      const count = await punchPortalContract.getTotalPunches();

      getAllPunches();
      setTotalPunches(count.toNumber());
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllPunches = async () => {
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

      const punches = await punchPortalContract.getAllPunches();
      let mappedPunches = punches.map((punch) => {
        return {
          address: punch.puncher,
          timestamp: new Date(punch.timestamp * 1000),
          message: punch.message,
        };
      });
      mappedPunches.sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1));
      setAllPunches(mappedPunches);
    } catch (error) {
      console.log(error);
    }
  };

  const punch = async () => {
    if (!message) return;

    setPunching(true);
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

      // Execute the punch function from the smart contract
      const punchTxn = await punchPortalContract.punch(message);
      console.log('Mining...', punchTxn.hash);

      await punchTxn.wait();
      console.log('Mined -- ', punchTxn.hash);

      getAllPunches();
      setTotalPunches(totalPunches + 1);
      setPunching(false);
    } catch (error) {
      setPunching(false);
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

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const punchPortalContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        abi,
        signer
      );

      const count = await punchPortalContract.getTotalPunches();

      getAllPunches();
      setTotalPunches(count.toNumber());
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
          <>
            <p className="bio">
              Punches withstood so far: <strong>{totalPunches}</strong>
            </p>
            {punching ? (
              <button className="waveButton">Getting punched...</button>
            ) : (
              <form className="form">
                <textarea
                  rows="6"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your strong message!"
                  maxLength="100"
                />
                <button type="button" className="waveButton" onClick={punch}>
                  Punch Me!
                </button>
              </form>
            )}
          </>
        ) : (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet!
          </button>
        )}

        {allPunches.map((punch, index) => {
          return (
            <div
              key={index}
              style={{
                backgroundColor: 'OldLace',
                marginTop: '16px',
                padding: '8px',
              }}
            >
              <div>
                <strong>Address:</strong> {punch.address}
              </div>
              <div>
                <strong>Time:</strong> {punch.timestamp.toString()}
              </div>
              <div>
                <strong>Message:</strong> {punch.message}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
