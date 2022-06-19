import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractAddress } from "../utils/utils.jsx"
import { abi } from "../utils/WavePortal.json";


export const useContract = () => {

  const [ allWaves, setAllWaves ] = useState([]);
  const [isMining, setIsMining] = useState(false);
  

   const getAllWaves = async () => {
     try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        
        const wavePortalContract = new ethers.Contract(contractAddress,         
        abi, signer);

        const allWaves = await wavePortalContract.getAllWaves();
        console.log("Retrieved total waves", allWaves);

        const allWavesFiltered = allWaves.map(({message, waver, timestamp}) => {
          return {
            message,
            waver,
            timestamp: (new Date(timestamp * 1000)).toString()
          }
        })

        setAllWaves(allWavesFiltered)

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const wave = async (inputText, setInputText) => {
    if(!inputText || inputText === " "){
      return;
    }
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        
        const wavePortalContract = new ethers.Contract(contractAddress,         
        abi, signer);

        setIsMining(true)

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

         /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await wavePortalContract.wave(inputText);
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait(1);
        console.log("Mined -- ", waveTxn.hash);

        getAllWaves()
        setInputText("")

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        setIsMining(false)
        
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
      setIsMining(false)
    }
  }

  
  useEffect(()=> {
   // getAllWaves() 
    
    let wavePortalContract;
  
    const onNewWave = (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message);
      setAllWaves(prevState => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };
  
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
  
      wavePortalContract = new ethers.Contract(contractAddress, abi, signer);
      wavePortalContract.on("NewWave", onNewWave);
    }
  
    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave);
      }
    };
    
}, [])

  return {
    allWaves,
    wave
  }
}