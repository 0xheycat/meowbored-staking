import { useEffect, useState } from "react";
import styles from "./faucet.module.css";
import { ethers } from "ethers";
import faucetContract from "./api/faucet";
import { Alert, TextField, Button } from "@mui/material";
import Confetti from 'react-canvas-confetti';
function faucet() {
  const [walletAddress, setWalletAddress] = useState("");
  const [signer, setSigner] = useState();
  const [fcContract, setFcContract] = useState();
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState("");
  const [transactionData, setTransactionData] = useState("");

  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
  }, [walletAddress]);

  const connectWallet = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setSigner(provider.getSigner());
        setFcContract(faucetContract(provider));
        setWalletAddress(accounts[0]);
        showAlert("success", "Wallet connected successfully!");
      } catch (err) {
        console.error(err.message);
        showAlert("error", err.message);
      }
    } else {
      console.log("Please install MetaMask");
    }
  };
  
  const getCurrentWalletConnected = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_accounts", []);
        if (accounts.length > 0) {
          setSigner(provider.getSigner());
          setFcContract(faucetContract(provider));
          setWalletAddress(accounts[0]);
          showAlert("success", "Wallet connected successfully!");
        } else {
          console.log("Connect to MetaMask using the Connect Wallet button");
        }
      } catch (err) {
        console.error(err.message);
        showAlert("error", err.message);
      }
    } else {
      console.log("Please install MetaMask");
    }
  };
  
  const addWalletListener = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        setWalletAddress(accounts[0]);
        showAlert("success", "Wallet address changed!");
      });
    } else {
      setWalletAddress("");
      console.log("Please install MetaMask");
    }
  };
  
  const getOCTHandler = async () => {
    setWithdrawError("");
    setWithdrawSuccess("");
    try {
      const fcContractWithSigner = fcContract.connect(signer);
      const resp = await fcContractWithSigner.requestTokens();
      setWithdrawSuccess("faucet has sent - stake your tokens!");
      setTransactionData(resp.hash);
      showAlert("success", "Tokens requested successfully!");
    } catch (err) {
      setWithdrawError(err.message);
      showAlert("error", err.message);
    }
  };
  
  const showAlert = (type, message) => {
    return (
      <Alert severity={type} onClose={() => setShowAlert(false)}>
        {message}
      </Alert>
    );
  };

  return (
    <div className={styles.myBodyClass}>
      <nav className="navbar" style={{ backgroundColor: "white", color: "white" }}>
        <div className="container">
          <div className="navbar-brand">
            <h1 className="navbar-item is-size-4"></h1>
          </div>
          <div id="navbarMenu" className="navbar-menu">
            <div className="navbar-end is-align-items-center">
              <Button
                className="is-white connect-wallet"
                onClick={connectWallet}
                variant="outlined"
              >
                <span className="is-link has-text-weight-bold">
                  {walletAddress && walletAddress.length > 0
                    ? `Connected: ${walletAddress.substring(0, 6)}...${walletAddress.substring(60)}`
                    : "Connect Wallet"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <section className="hero is-fullheight" style={{ marginTop: "10px" }}>
        <div className="faucet-hero-body">
          <div className="container has-text-centered main-content" style={{ maxWidth: "0x !important" }}>
            <h1 className="title" style={{ color: "black", marginBottom: "1rem" }}>BTC Faucet</h1>
            <p style={{ color: "black" }}>Get 1000 BTC/1H, please enter your address below.</p>
            <div className="box address-box" style={{ padding: "2em" }}>
              <div className="columns">
                <div className="column is-four-fifths">
                  <TextField
                    className="input is-medium"
                    style={{ width: "100%", fontSize: "18px" }} // Customize size here
                    variant="outlined"
                    type="text"
                    placeholder="Enter your wallet address (0x...)"
                    defaultValue={walletAddress}
                  />
                </div>
                <div className="column">
                  <Button
                    className="button is-link is-medium"
                    style={{ width: "100%", fontSize: "20px" }} // Customize size here
                    onClick={getOCTHandler}
                    disabled={!walletAddress}
                    variant="contained"
                  >
                    GET FAUCET
                  </Button>
                </div>
              </div>
              {/* New button */}
              <div className="columns">
                <div className="column">
                  <Button
                    className="button is-link is-medium"
                    style={{ width: "100%", fontSize: "20px", marginTop: "10px" }} // Customize size and margin here
                    onClick={async () => {
                      await window.ethereum.request({
                        "method": "wallet_watchAsset",
                        "params": {
                          "type": "ERC20",
                          "options": {
                            "address": "0x2960f02599055C0D54eCD966b93FD4454b458756",
                            "symbol": "BTC",
                            "decimals": 18
                          }
                        }
                      });
                    }}
                    variant="contained"
                  >
                    Add BTC Token
                  </Button>
                </div>
              </div>
            </div>
            <article className="panel panel-heading" style={{ backgroundImage: "linear-gradient(to left, #38052F, #070709)", backgroundColor: "black", color: "white", padding: "10px" }}>
  <p>Transaction Data</p>
  <div className="panel-block">
    <div className="mt-5">
      {withdrawError && (
        <div className="withdraw-error" style={{ color: "red" }}>{withdrawError}</div>
      )}
      {withdrawSuccess && (
        <div className="withdraw-success" style={{ color: "green" }}>{withdrawSuccess}</div>
      )}
    </div>
    <p>{transactionData ? `Transaction hash: ${transactionData}` : "--"}</p>
  </div>
  {withdrawSuccess && (
    <Confetti
      width={window.innerWidth}
      height={window.innerHeight}
    />
  )}
</article>
          </div>
        </div>
      </section>
    </div>
  );
}
export default faucet;

