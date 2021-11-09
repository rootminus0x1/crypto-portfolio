import React, { useState, useEffect } from 'react';
import './App.css';
import { Clock, format } from './datetime';
import { covalentBalances } from './covalentAPI';

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
              </tr>
            {data.items.filter(item=> item.balance !== "0").map(item=>{
              const balance = item.balance / Math.pow(10, item.contract_decimals);
              return (
              <tr>
                <td>{item.contract_name}</td>
                <td>{item.contract_ticker_symbol}</td>
                <td>{balance}</td>
                <td>{item.quote_rate}</td>
                <td>{item.quote_rate * balance}</td>
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