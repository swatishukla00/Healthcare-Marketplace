import React, { useState, useEffect } from "react";
import { Contract, BrowserProvider } from "ethers";

const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
const abi = [
  "function giveConsent() public",
  "function revokeConsent() public",
  "function hasConsented(address) public view returns (bool)",
];

function ConsentPanel() {
  const [account, setAccount] = useState(null);
  const [consent, setConsent] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    const browserProvider = new BrowserProvider(window.ethereum);
    setProvider(browserProvider);

    window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => setAccount(accounts[0]))
      .catch(() => alert("Wallet connection rejected"));
  }, []);

  async function checkConsent() {
    if (!account || !provider) return;
    const contract = new Contract(contractAddress, abi, provider);
    const status = await contract.hasConsented(account);
    setConsent(status);
  }

  async function giveConsent() {
    const signer = await provider.getSigner();
    const contract = new Contract(contractAddress, abi, signer);
    await contract.giveConsent();
    checkConsent();
  }

  async function revokeConsent() {
    const signer = await provider.getSigner();
    const contract = new Contract(contractAddress, abi, signer);
    await contract.revokeConsent();
    checkConsent();
  }

  useEffect(() => {
    if (account && provider) {
      checkConsent();
    }
  }, [account, provider]);

  return (
    <div>
      <h4>Consent Management</h4>
      {!account && <p>Connecting MetaMask...</p>}
      {account && (
        <div>
          <p>Connected account: {account}</p>
          <p>
            Consent status:{" "}
            {consent === null ? "Loading..." : consent ? "Given" : "Revoked"}
          </p>
          <button className="btn btn-success me-2" onClick={giveConsent}>
            Give Consent
          </button>
          <button className="btn btn-danger" onClick={revokeConsent}>
            Revoke Consent
          </button>
        </div>
      )}
    </div>
  );
}

export default ConsentPanel;
