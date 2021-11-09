var http = require('http');

const covalentAPIKEY = 'ckey_0d21a57dcbbd464aa0a1eb0a2ad';

class CovalentAPI {
/*
  constructor() {
    covalentAPIKEY = 'ckey_0d21a57dcbbd464aa0a1eb0a2ad';
  }
*/
  covalentAddress(chain, address, req, callback) {
    var options = {
        host: "api.covalenthq.com",
        path: "/v1"
        + "/" + chain
        + "/address/" + address
        + "/" + req
        + "/?key=" + covalentAPIKEY,
    };
    http.request(options, callback).end();
  }

  covalentAddressNow(chain, address, req)
  {
    var url = "https://api.covalenthq.com/v1"
      + "/" + chain
      + "/address/" + address
      + "/" + req
      + "/?key=" + covalentAPIKEY;
      http.fetch(url).then(data=>{return data.json()});
  }
}


/*
function covalent_pricing(tickers_comma_sep) {
  var url = "https://"+endpoint
    + "/pricing/tickers/?tickers=" + tickers_comma_sep
    + "/&key="+api_key;
  //return url;
  return httpget(url);
}
*/

export default CovalentAPI;

