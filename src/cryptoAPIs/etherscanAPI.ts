const etherscanAPIKEY = 'SRHPT93DK2SVSCR5BB8BBJNTUBQX8FQ1H9';
const etherscanEndpoint = 'https://api.etherscan.io/api';


export function etherscanGetBalance(address: string) {
  var url = etherscanEndpoint
  + "?module=account"
  + "&action=balance"
  + "&address=" + address
  + "&tag=latest"
  + "&apikey=" + etherscanAPIKEY;

  return fetch(url);
}

export function etherscanContractABI(address: string) {
    var url = etherscanEndpoint
    + "?module=contract"
    + "&action=getabi"
    + "&address=" + address
    + "&apikey=" + etherscanAPIKEY;
  
    return fetch(url);
  }
  