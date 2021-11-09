import React, { useState, useEffect } from 'react';
import './App.css';
import { Clock, format } from './datetime';
import { covalentBalances, covalentPricing } from './covalentAPI';

let accounts = [
  {
    name: "Jane",
    publicKey: "0x2f5E08Ef5A99a98336519E54F58D503F550BD9AC",
    chains: [1, 137]
  },
  {
    name: "Tom",
    publicKey: "0x7375cab33FdBDD0616C70aF5531b100eb06f8592",
    chains: [1, 137]
  }
];

// if this list gets long, best switch to a map, or do a chain specific exclude list
let excludedCoins = [
  "ThankYou",
  "softbalanced.com",
  "RicheSwap.io",
  "LitCoin",
  "Go Buy SpaceRat at SpaceRat.Finance",
  "DxDex.io",
  "aaxexchange.org",
  "TAO Coin",
  "BeezEX.Net",
  "MegaDoge.Org",
  "Zepe.io",
  "Polyroll Token",
]

let pricingMethod = [
  {ticker: "USDC", method: "covalentTicker"},
];

let tickerCache = covalentPricing(
  pricingMethod
  .filter(mapping => mapping.method === "covalentTicker")
  .map((x) => {return x.ticker;})
  );


function ChainPortfolio(props) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [start] = useState(Date());

  useEffect(() => {
    covalentBalances(props.chain, props.publicKey)
    .then(response => response.json())
    .then(
      (json) => {
        setData(json.data);
        setError(json.error_message);
      },
      (error) => {
        setError("network error: " + error);
      }
    )
  }, [props.chain, props.publicKey]);

  return (
    <div className="chain-portfolio">
      <h3>{nameOfChain(props.chain)}</h3>
      <div>
        {data ? (
          <div>
              <tr>
                <th>Name</th>
                <th>Symbol</th>
                <th>Balance</th>
                <th>$ Quote</th>
                <th>$ Value</th>
                <th>contract</th>
              </tr>
            {data.items
            .filter(item => !excludedCoins.includes(item.contract_name)) // remove unwanted coins
            .filter(item => item.balance !== "0") // remove zero balance
            .map(item => {
              const balance = item.balance / Math.pow(10, item.contract_decimals);
              return (
              <tr>
                <td>{item.contract_name}</td>
                <td>{item.contract_ticker_symbol}</td>
                <td>{balance}</td>
                <td>{item.quote_rate}</td>
                <td>{item.quote_rate * balance}</td>
                <td>{item.contract_address}</td>
              </tr>
              );
            }
            )}
          </div>
        ) : error ? (
          <div>ERROR: {error}</div>
        ) : (
          <div>Loading portfolio (since {format(start)}) ...</div>
        )}
      </div>
    </div>
  );
}

function nameOfChain(id) {
  if (id === 1) {
    return "Ethereum";
  } else if (id === 137) {
    return "Polygon";
  } else {
    return "Chain " + id;
  }
}

function Account(props) {
  return (
    <div className="account">
      <tr><h2>{props.name} ({props.publicKey})</h2></tr>
      {props.chains.map((chain)=>{
        return <tr><ChainPortfolio publicKey={props.publicKey} chain={chain}/></tr>
      })}
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h1>Crypto Tracker</h1>
          <Clock/>
          <table>
          {accounts.map((account)=>{
            return <tr><Account name={account.name} publicKey={account.publicKey} chains={account.chains}/></tr>
          })}
          </table>
        </div>
      </header>
    </div>
  );
}

export default App;