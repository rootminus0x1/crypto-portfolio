import React, { useState, useEffect } from 'react';
import './App.css';
import {Clock} from './datetime';

//import './covalentAPI';
//import CovalentAPI from './covalentAPI';


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

//let covalentAPI = new CovalentAPI();
const covalentAPIKEY = 'ckey_0d21a57dcbbd464aa0a1eb0a2ad';

class ChainPortfolio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      response: null,
      error: "",
      time: new Date().toLocaleString(),
      };
  }

  componentDidMount() {
    var url = "https://api.covalenthq.com/v1"
    + "/" + this.props.chain
    + "/address/" + this.props.publicKey
    + "/balances_v2"
    + "/?key=" + covalentAPIKEY;

    fetch(url)
      .then(response => response.json())
      .then(
        (json) => {
          if (json.data) {
            this.setState({response: (
              <div>
                <tr>
                  <th>Name</th>
                  <th>Symbol</th>
                  <th>Balance</th>
                  <th>$ Quote</th>
                  <th>$ Value</th>
                </tr>
              {json.data.items.filter(item=> item.balance !== "0").map(item=>{
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
              </div>)});
          } else if (json.error_message) {
            this.setState({error: "error: " + json.error_message + " [" + url + "]"});
          }
        },
        (error) => {
          this.setState({error: "network error: " + error});
        }
      )
    }

  render() {
    return (
      <div className="chain-portfolio">
        <h3>{this.nameOfChain(this.props.chain)}</h3>
        <div>
          {this.state.response ? (
            <div>{this.state.response}</div>
          ) : this.state.error ? (
            <div>ERROR: {this.state.error}</div>
          ) : (
            <div>Loading (since {new Date().toLocaleString()})...</div>
          )}
        </div>
      </div>
    );
  }

  nameOfChain(id) {
    if (id === 1) {
      return "Ethereum";
    } else if (id === 137) {
      return "Polygon";
    } else {
      return "Chain " + id;
    }
  }
}

class Account extends React.Component {
  render() {
    return (
      <div className="account">
        <tr><h2>{this.props.name} ({this.props.publicKey})</h2></tr>
        {this.props.chains.map((chain)=>{
          return <tr><ChainPortfolio publicKey={this.props.publicKey} chain={chain}/></tr>
        })}
      </div>
    )
  }
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
