import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ConnectWallet from './components/ConnectWallet';
import CertificationForm from './components/CertificationForm';
import CertificationList from './components/CertificationList';
import Navigation from './components/Navigation';
import VerifyCertification from './components/VerifyCertification';
import IssuerDashboard from './components/IssuerDashboard';
import Dashboard from './components/Dashboard';
import contractABI from './contracts/DecentralizedSkillCertification.json';
import './App.css';
import IssuerRoute from './components/IssuerRoute';
import CertificateLookup from './components/CertificateLookup';
import AddressSwitcher from './components/AddressSwitcher';

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace after deployment
const TEST_PRIVATE_KEY = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
const TEST_ACCOUNT = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
const ISSUER_ADDRESS = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; // Your test account as issuer

function App() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [isIssuer, setIsIssuer] = useState(false);

  const connectWallet = async () => {
    try {
      // Use local provider and test account instead of MetaMask
      const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
      const wallet = new ethers.Wallet(TEST_PRIVATE_KEY, provider);
      
      const contract = new ethers.Contract(
        contractAddress,
        contractABI.abi,
        wallet
      );

      setProvider(provider);
      setContract(contract);
      setAccount(TEST_ACCOUNT);
      // Set issuer status based on account
      setIsIssuer(TEST_ACCOUNT.toLowerCase() === ISSUER_ADDRESS.toLowerCase());

    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Error connecting to local network");
    }
  };

  const switchAddress = async (newAddress) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
      const wallet = new ethers.Wallet(TEST_PRIVATE_KEY, provider);
      
      const contract = new ethers.Contract(
        contractAddress,
        contractABI.abi,
        wallet
      );

      // Check if the new address is an issuer
      // You might want to add a contract function to check this
      const isNewAddressIssuer = newAddress.toLowerCase() === ISSUER_ADDRESS.toLowerCase();

      setProvider(provider);
      setContract(contract);
      setAccount(newAddress);
      setIsIssuer(isNewAddressIssuer);

    } catch (error) {
      console.error("Error switching address:", error);
      alert("Error switching address");
    }
  };

  // Remove MetaMask event listeners since we're using a local account
  useEffect(() => {
    connectWallet(); // Auto-connect on component mount
  }, []);

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Decentralized Skill Certification</h1>
          <ConnectWallet 
            account={account} 
            onConnect={connectWallet} 
          />
          {account && <Navigation isIssuer={isIssuer} />}
        </header>
        <main>
          {account ? (
            <>
              <Routes>
                <Route path="/" element={
                  <Dashboard 
                    contract={contract} 
                    account={account} 
                    isIssuer={isIssuer}
                  />
                } />
                
                {/* Issuer Routes */}
                <Route path="/issue" element={
                  <IssuerRoute isIssuer={isIssuer}>
                    <CertificationForm contract={contract} account={account} />
                  </IssuerRoute>
                } />
                <Route path="/issuer-dashboard" element={
                  <IssuerRoute isIssuer={isIssuer}>
                    <IssuerDashboard contract={contract} account={account} />
                  </IssuerRoute>
                } />

                {/* Receiver Routes */}
                <Route path="/my-certifications" element={
                  <CertificationList contract={contract} account={account} />
                } />
                <Route path="/verify" element={
                  <VerifyCertification contract={contract} />
                } />
                <Route path="/lookup" element={
                  <CertificateLookup contract={contract} />
                } />
              </Routes>
              <AddressSwitcher 
                onSwitch={switchAddress}
                currentAccount={account}
                isIssuer={isIssuer}
              />
            </>
          ) : (
            <div className="form-container">
              <h2>Welcome to Skill Certification</h2>
              <p>Please connect your wallet to continue</p>
            </div>
          )}
        </main>
      </div>
    </Router>
  );
}

export default App;
