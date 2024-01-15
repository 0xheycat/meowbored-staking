import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { poolDb } from '../components/poolsdb';
import { getPoolDetails, action, autoCompound } from '../components/config';
import { Box, Button, Container } from "@mui/material";
import "98.css";
import "98.css/dist/98.css";
import Link from 'next/link'

export default function Farms() {
  const [poolArray, getPoolArray] = useState([]);
  const [loadingState, setLoadingState] = useState(false);
  <Link href="/claimPage">
    <a>Claim Tokens</a>
  </Link>

  useEffect(() => {
    getPoolInfo();
  }, []);

  const getPoolInfo = async () => {
    setInterval(async () => {
      let poolArray = await getPoolDetails();
      getPoolArray(poolArray);
    }, 5000);
  };

  useEffect(() => {
    if (poolArray[0] !== undefined) {
      setLoadingState(true);
    }
  }, [poolArray]);

  const showModal = (i) => {
    const { Modal } = require("bootstrap");
    const myModal = new Modal("#autorunmodal" + i);
    myModal.show();
  };

  const stakeTokens = async (i, tokenAddress) => {
    let amount = document.getElementById("amt" + i).value;
    let result = await action(i, amount, tokenAddress, "stake");
    if (result === true) {
      let output = 'Stake Completed!';
      document.getElementById("result").innerHTML = output;
    }
  };

  const unstakeTokens = async (i, tokenAddress) => {
    let amount = document.getElementById("amt" + i).value;
    let result = await action(i, amount, tokenAddress, "unstake");
    if (result === true) {
      let output = 'Unstake Completed!';
      document.getElementById("result").innerHTML = output;
    }
  };

  if (loadingState === false) return (
    <div className='window window--win98'>
      <Head>
        <title>meowbored</title>
        <meta name="description" content="Meowbored" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://unpkg.com/98.css" />
      </Head>
      <div className='window__navbar'>
        <div className='window__controls'>
          <div className='window__controls__button window__controls__button--close'></div>
          <div className='window__controls__button window__controls__button--minimize'></div>
          <div className='window__controls__button window__controls__button--maximize'></div>
        </div>
      </div>
      <main className="container">
        <div className="my-4 mx-5 rounded shadow-sm">
          <h3 className='my-3'></h3>
        </div>
        <h5></h5>
      </main>
    </div>
  );

  return (
    <div className='window window--win98'>
      <Head>
        <title>meowbored</title>
        <meta name="description" content="meowbored" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://unpkg.com/98.css" />
      </Head>
      <div className='window__navbar'>
        <div className='window__controls'>
          <div className='window__controls__button window__controls__button--close'></div>
          <div className='window__controls__button window__controls__button--minimize'></div>
          <div className='window__controls__button window__controls__button--maximize'></div>
        </div>
      </div>
      <Container className='container'>
        <div className="col-lg-10 my-2 mx-auto rounded shadow-sm" style={{ backgroundColor: '#c0c0c0' }}>
          <h3 className='mx-auto'>DeFI Staking Pools</h3>
        </div>
        {poolDb.map((data, i) => (
          <div
            key={i}
            className="d-flex align-items-center col-lg-10 mx-auto p-2 pb-1 mb-1 text-white rounded shadow-sm"
            style={{ backgroundColor: '#808080', margin: '10px', padding: '10px' }}
          >
            <div className='d-grid col-2 mx-3'>
              <h6>Stake {data.lptoken}, Earn {data.rwdtoken} </h6>
              <h3 className="text-white"><img src={data.lplogo} width={70} alt="" />/<img src={data.rwlogo} width={70} alt="" /></h3>
              <small></small>
            </div>
            <div className='d-grid col-2'>
              <h6>APY</h6>
              <h5>{poolArray[i].apy}%</h5>
            </div>
            <div className='d-grid col-2 '>
              <h6>My Stakings</h6>
              <h5 style={{ color: '#02D8E9', textShadow: '0px 0px 1px #ffffff90' }}>{poolArray[i].userstaked}</h5>
            </div>
            <div className='d-grid col-2'>
              <h6>Pending Rewards</h6>
              <h5 style={{ color: '#39FF14' }}>{poolArray[i].reward}</h5>
            </div>
            <div className='d-grid col-2 mx-1'>
              <h6>Total Staked In Pool</h6>
              <h5>{poolArray[i].totalstaked} <img src={data.lplogo} width={50} alt="" /></h5>
            </div>
            <div className='d-grid col'>
              <Button type="button" className="btn btn-md stakestyle" onClick={() => showModal(i)}>
                Open Pool
              </Button>
              <div id={"autorunmodal" + i} className="modal fade" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content" style={{ background: '#05014a' }}>
                    <div className="modal-header" style={{ background: '#000000' }}>
                      <h4 className="modal-title">Stake <img src={data.lplogo} width={50} alt="" />/<img src={data.rwlogo} width={50} alt="" /></h4>                 
                      <div id='result' />
                    </div>
                    <div className="modal-body mx-auto col-10">
                      <div className='d-grid mx-auto col-10'>
                        <input style={{ background: '#ffffff40', color: 'white', border: 'none' }} className='form-control' type='text' id={'amt' + i} placeholder='Input Amount'></input>
                      </div>
                      <div className='row pb-2' style={{ fontWeight: '800' }}>
                        <div className='d-grid mx-auto col-4 mt-2'>
                          <button onClick={() => stakeTokens(i, poolArray[i].tokenaddr)} className='btn btn-dark'>STAKE</button>
                        </div>
                        <div className='d-grid mx-auto col-4 mt-2'>
                          <button onClick={() => unstakeTokens(i, poolArray[i].tokenaddr)} className='btn btn-dark'>UNSTAKE</button>
                        </div>
                      </div>
                      <div className='d-grid mx-auto col-6'>
                        <button onClick={autoCompound} className={data.autocompclass}>{data.autocompound}</button>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <div className='d-grid col'>
                        <h6>Your Stakings</h6>
                        <h5 style={{ color: '#02D8E9', textShadow: '0px 0px 1px #ffffff90' }}>{poolArray[i].userstaked}</h5>
                      </div>
                      <div className='d-grid col'>
                        <h6>Your Earnings</h6>
                        <h5 style={{ color: '#39FF14', textShadow: '0px 0px 1px #ffffff90' }}>{poolArray[i].reward}</h5>
                      </div>
                      <div className='d-grid col'>
                        <h6>Multiplier</h6>
                        <h4 style={{ color: 'red', textShadow: '0px 0px 1px #ffffff' }}>x{poolArray[i].multiplier}</h4>
                      </div>
                      <div className='d-grid col'>
                        <h6>In Your Wallet</h6>
                        <h5 style={{ color: 'white', textShadow: '0px 0px 1px #ffffff' }}>{poolArray[i].userbalance}</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Container>
    </div>
  );
}