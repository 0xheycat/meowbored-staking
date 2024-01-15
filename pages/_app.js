import { useState, useEffect } from "react";
import { AppBar, Box, Button, Container, Link, Toolbar, Typography } from "@mui/material";
import "98.css";
import "98.css/dist/98.css";
import "bootstrap/dist/css/bootstrap.min.css";

function MyApp({ Component, pageProps }) {
  const [status, setStatus] = useState("Connect Wallet");
  const [networkId, setNetworkId] = useState(null);

  async function checkNetwork() {
    try {
      const networkId = await ethereum.request({ method: "eth_chainId" });
      setNetworkId(networkId);
      if (networkId !== "0x7f8c26") {
        switchNetwork();
      }
    } catch (error) {
      console.error("Error checking network:", error);
    }
  }

  function connect() {
    if (window.ethereum) {
      window.ethereum
        .request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x7f8c26" }],
        })
        .then(checkNetwork)
        .catch((error) => {
          console.error("Error switching network:", error);
        });
    } else {
      console.error("Metamask extension not detected.");
    }
  }

  async function switchNetwork() {
    try {
      await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x7f8c26",
            chainName: "meowbored",
            nativeCurrency: {
              name: "meowbored",
              symbol: "BLUED",
              decimals: 18,
            },
            rpcUrls: ["https://meowbored.pro/"],
          },
        ],
      });
    } catch (error) {
      console.error("Error switching to custom network:", error);
    }
  }

  useEffect(() => {
    setInterval(() => {
      let walletid = localStorage.getItem("wallet");
      if (walletid !== null) {
        setStatus("Connected");
      }
    }, 4000);
  }, []);

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  useEffect(() => {
    checkNetwork();
    ethereum.on("chainChanged", checkNetwork);
  }, [checkNetwork]);

const homeLink = "/";
const faucetLink = "https://faucet-meow.vercel.app/";
const portalLink = "https://portal.dymension.xyz/rollapps";
const BTCLink = "/faucet";
return (
  <div>
    <AppBar position="static" className="p-1 text-light bg-primary win98-header">
      <Toolbar className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start win98-container">
        <Link href={homeLink} className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
          <img
            width="120"
            height="55"
            src="https://raw.githubusercontent.com/fatalbar/image-/main/meowboreds.png"
            alt="Logo"
          />
        </Link>
        <Box component="ul" className="nav col-12 col-lg me-lg mb-2 justify-content-start mb-md-0 win98-nav">
          <li>
            <Link href={homeLink} className="nav-link px-3 text-white">
              Stake
            </Link>
          </li>
          <li>
            <Link href={faucetLink} className="nav-link px-3 text-white">
              Faucet
            </Link>
          </li>
          <li>
            <Link href={portalLink} className="nav-link px-3 text-white">
              Dymension Portal
            </Link>
          </li>
          <li>
            <Link href={BTCLink} className="nav-link px-3 text-white">
              BTC faucet
            </Link>
          </li>
        </Box>
        <Button className="btn btn-default win98-btn ml-auto" onClick={connect}>
          {status} ({networkId})
        </Button>
        <Button className="btn btn-default win98-btn ml-auto" onClick={async () => {
                      await window.ethereum.request({
                      "method": "wallet_addEthereumChain",
                      "params": [
                        {
                          "blockExplorerUrls": [
                            "https://meowbored.pro/"
                          ],
                          "iconUrls": [
                            "https://raw.githubusercontent.com/fatalbar/image-/main/meowboreds.png"
                          ],
                          "nativeCurrency": {
                            "name": "meowbored",
                            "symbol": "blued",
                            "decimals": 18
                          },
                          "rpcUrls": [
                            "https://meowbored.pro"
                          ],
                          "chainId": "0x7f8c26",
                          "chainName": "meowbored"
                        }
                      ]
                    });}}>
                      Add meowbored network
    </Button>
      </Toolbar>
    </AppBar>
    <Component {...pageProps} />
  </div>
  );
}

export default MyApp;
