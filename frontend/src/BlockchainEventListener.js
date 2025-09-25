import { useEffect } from "react";
import { Contract, BrowserProvider } from "ethers";

const contractAddress = "0x7EF2e0048f5bAeDe046f6BF797943daF4ED8CB47";
const abi = [ /* Your contract ABI JSON here */ ];

function BlockchainEventListener() {
  useEffect(() => {
    async function listenEvents() {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }
      const provider = new BrowserProvider(window.ethereum);
      const contract = new Contract(contractAddress, abi, provider);

      contract.on("ConsentGiven", (account) => {
        console.log("Consent given by:", account);
        alert(`Consent given by: ${account}`);
      });

      return () => {
        contract.removeAllListeners("ConsentGiven");
      };
    }
    listenEvents();
  }, []);

  return null;
}

export default BlockchainEventListener;
