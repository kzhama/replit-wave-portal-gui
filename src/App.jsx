import React, { useState } from "react";
import './App.css';
import { useWallet } from "./hooks/useWallet.jsx"
import { useContract } from "./hooks/useContract.jsx"


export default function App() {
  const { connectWallet, currentAccount } = useWallet();
  const { allWaves, wave } = useContract();

  const [ inputText, setInputText ] = useState("")
 
  return (
      <div className="mainContainer">
        {!currentAccount && <div className="connectWallet_wrapper">
         <button className="connectWallet_button" onClick={connectWallet}>
            Connect wallet
         </button>
      </div>
      }
        <div className="dataContainer">
          <div className="header">
          👋 Hey there!
          </div>
  
          <div className="bio">
            I am Karen. Im working on my Web 3 App. With this app you can say hello to me in a decentralized manner. Connect your wallet and hit that button ! 🚀
          </div>
          <div className="input-group input-group mb-3">
              <span className="input-group-text" id="inputGroup-sizing-default">Required*</span>
            <input type="text" className="form-control" placeholder="Type the message you want to send me" onChange={(e) => setInputText(e.target.value)} value={inputText}/>
          </div>
          {!!inputText && inputText !== " " &&
          <a href="#" className="neon-button" onClick={() => wave(inputText, setInputText)}>Send cosmic Hi 🚀</a>
          }
        </div>

        {allWaves.length && (
        <div className="table-wrapper">
            <table className="table table-dark table-striped table-bordered">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Address</th>
                  <th scope="col">Message</th>
                  <th scope="col">TimeStamp</th>
                </tr>
              </thead>
              <tbody>
                {allWaves.map(({message, waver, timestamp}, index)=> {
                      return (
                         <tr key={timestamp}>
                            <th scope="row">{index + 1}</th>
                            <td>{waver}</td>
                            <td>{message}</td>
                           <td>{timestamp}</td>
                          </tr>
                      )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
  );
}

