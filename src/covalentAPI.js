const covalentAPIKEY = 'ckey_0d21a57dcbbd464aa0a1eb0a2ad';
const covalentEndpoint = 'https://api.covalenthq.com/v1';


export function covalentAddress(chain, address, req) {
  var url = covalentEndpoint
  + "/" + chain
  + "/address/" + address
  + "/" + req
  + "/?key=" + covalentAPIKEY;

  return fetch(url);
}

export function covalentBalances(chain, address)
{
  return covalentAddress(chain, address, "balances_v2");
}
  
export function covalentPricing(tickers) {
  var url = covalentEndpoint
    + "/pricing/tickers/?tickers=" + tickers.join()
    + "/&key=" + covalentAPIKEY;

  return fetch(url);
}

