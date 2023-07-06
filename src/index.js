import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

//import * as covalentAPI from './covalentAPI';

import {covalentAddress} from './covalentAPI';

// const EtherScanAPIKEY = 'SRHPT93DK2SVSCR5BB8BBJNTUBQX8FQ1H9';
// var etherscanAPI = require('etherscan-api').init(APIKEY);

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

class Holding extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    return (
      <div className="holding">
        <div>{this.props.contract}</div>
        <div>{this.state.value}</div>
      </div>
    );
  }
}

class ChainPortfolio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    //covalentAddress(this.props.chain, this.props.publicKey, "balances_V2", this.updateBalances);
  }
  render() {
    //var balance = etherscanAPI.account.balance(this.props.publicKey);
    
    return (
      <div className="chain-portfolio">
        {this.nameOfChain(this.props.chain)}
        <div>
          {this.state === {} ? (
            <div>Loading...</div>
          ) : (
            <div>Loaded: {this.state}</div>

          )}
        </div>
      </div>
    )
  }

  updateBalances(response)
  {
    this.state = response;
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
        <h2>{this.props.name} ({this.props.publicKey})</h2>
        <ul>
        {this.props.chains.map((chain)=>{
          return <li><ChainPortfolio publicKey={this.props.publicKey} chain={chain}/></li>
        })}
        </ul>
      </div>
    )
  }
}

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Crypto Tracker</h1>
        <ul>
        {accounts.map((account)=>{
          return <li><Account name={account.name} publicKey={account.publicKey} chains={account.chains}/></li>
        })}
        </ul>
      </div>
    )
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
