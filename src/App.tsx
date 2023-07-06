import { useState, useEffect } from 'react'
import './App.css'
import { Clock, format } from './datetime'
import { covalentBalances } from './cryptoAPIs/covalentAPI'
//import { Counter } from './features/counter/Counter'
import { etherscanContractABI } from './cryptoAPIs/etherscanAPI'

var Web3 = require('web3');
const web3HttpProvider = 'https://mainnet.infura.io/v3/2ff4e19f0b2b49a4bdfe8d26c3fb8cb1';
var web3 = new Web3( new Web3.providers.HttpProvider(web3HttpProvider) );
console.log("web3 version: " + web3.version);


/*
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
*/
let accounts = [
  {
    name: "Jane",
    publicKey: "0x2f5E08Ef5A99a98336519E54F58D503F550BD9AC",
    chains: [1, 137]
  },
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
  "Go Buy Polydoge",
]

// selects the pricer for the symbol
function useChainPrice(chain: number, symbol: string, address: string, decimals: number, quote: number) {
  const [price, setPrice] = useState<number>(NaN);
  
  useEffect(() => {
    if ((chain === 1) && (symbol === "yvCurve-MIM")) {
      console.log("fetching price data for " + [chain, symbol, address, decimals, quote]);
      //console.trace();
      etherscanContractABI(address)
      .then(response => response.json())
      .then(json => {
        var contractABI = JSON.parse(json.result);
        console.log(contractABI);
        var contract = new web3.eth.Contract(contractABI, address);
        contract.methods.pricePerShare().call()
        .then((result: number) => {
          setPrice(result / Math.pow(10, decimals));
        });
      });
    } else {
      setPrice(quote);
    }
  }, [chain, symbol, address, decimals, quote]);

  return price;
}

type ChainPriceProps = {
  chain: number;
  symbol: string;
  contract: string;
  decimals: number;
  quote: number;
}

function ChainPrice(props: ChainPriceProps) {
  const price = useChainPrice(props.chain, props.symbol, props.contract, props.decimals, props.quote);

  if (price >= 0) {
    return ( <div> ${price} </div> );
  } else {
    return (( <div> Loading... </div> ));
  }  
}

type ChainPortfolioValueProps = {
  chain: number;
  symbol: string;
  contract: string;
  decimals: number;
  quote: number;
  balance: number;
}

// value = price * balance
// updated each time either of price (likely) or balance (unlikely) changes
function ChainPortfolioValue(props: ChainPortfolioValueProps) {
  const price = useChainPrice(props.chain, props.symbol, props.contract, props.decimals, props.quote);
  if (isNaN(price)) {
    return ( <div> Loading... </div> );
  } else {
    return ( <div> ${(price * props.balance).toFixed(0).toLocaleString()} </div> );
  }
}

type ChainPrortfolioProps = {
  chain: number;
  publicKey: string;
}

type CovalentBalance = {
  contract_name: string;
  balance: number;
  contract_decimals: number; 
  contract_ticker_symbol: string; 
  contract_address: string; 
  quote_rate: number;
}

type CovalentBalances = {
  items: CovalentBalance[];
}

function ChainPortfolio(props: ChainPrortfolioProps) {
  const [data, setData] = useState<CovalentBalances | null>(null);
  const [error, setError] = useState("");
  const [start] = useState(new Date());

  useEffect(() => {
    console.log("fetching balances for chain " + props.chain + " address " + props.publicKey);
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
      {data ? (
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Balance</th>
              <th>$ Quote</th>
              <th>$ Value</th>
            </tr>
          </thead>
          <tbody>
            {data.items
            .filter((item) => !excludedCoins.includes(item.contract_name)) // remove unwanted coins
            .filter((item) => item.balance > 1) // remove zero(ish) balance
            .map((item) => {
              const balance = item.balance / Math.pow(10, item.contract_decimals);
              const price = item.quote_rate === null ? NaN : item.quote_rate; 
              return (
              <tr>
                <td>{item.contract_ticker_symbol}</td>
                <td>{balance}</td>
                <td><ChainPrice
                    chain={props.chain}
                    symbol={item.contract_ticker_symbol} 
                    contract={item.contract_address}
                    decimals={item.contract_decimals}
                    quote={price}
                  /> 
                </td>
                <td><ChainPortfolioValue
                    balance={balance}
                    chain={props.chain}
                    symbol={item.contract_ticker_symbol} 
                    contract={item.contract_address}
                    decimals={item.contract_decimals}
                    quote={price}
                  />
                </td>
              </tr>
              );
            }
          )}
          </tbody>
        </table>
      ) : error ? (
        <div>ERROR: {error}</div>
      ) : (
        <div>Loading portfolio (since {format(start)}) ...</div>
      )}
    </div>
  );
}

function nameOfChain(id: string | number) {
  if (id === 1) {
    return "Ethereum";
  } else if (id === 137) {
    return "Polygon";
  } else {
    return "Chain " + id;
  }
}

type AccountProps = {
  name: string;
  publicKey: string;
  chains: number[];
}

function Account(props: AccountProps) {
  return (
    <div className="account">
      <h2>{props.name} ({props.publicKey})</h2>
      {props.chains.map((chain)=>{
        return <ChainPortfolio publicKey={props.publicKey} chain={chain}/>
      })}
    </div>
  )
}

function App() {
  console.log("running App");

  return (
    <div className="app">
      <h1>Crypto Tracker</h1>
      <Clock/>
      {accounts.map((account)=>{
        return <Account 
        name={account.name} 
        publicKey={account.publicKey} 
        chains={account.chains}/>
      })}
    </div>
  );
}

export default App;