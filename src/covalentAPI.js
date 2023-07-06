import {request} from 'http';

const covalentAPIKEY = 'ckey_0d21a57dcbbd464aa0a1eb0a2ad';

/**
 * Get all addresses.
 *
 * @param {String} [interfaceName] interface name, default is 'eth' on linux, 'en' on mac os.
 * @param {Function(err, addr)} callback
 *  - {Object} addr {
 *    - {String} ip
 *    - {String} ipv6
 *    - {String} mac
 *  }
 */

export function covalentAddress(chain, address, req, callback) {
    var options = {
        host: "api.covalenthq.com",
        path: "/v1"
        + "/" + chain
        + "/address/" + address
        + "/" + req
        + "/?key=" + covalentAPIKEY,
    };
    request(options, callback).end();
    return;
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

