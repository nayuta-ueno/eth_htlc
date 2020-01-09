exports.CONTRACT_ADDR = '0x966DDb04A554b0C426b98f012ac8BBaB1D3b1bF6';

const PROVIDER_HTTP = 'http://10.0.1.80:8545';
const PROVIDER_WS = 'ws://10.0.1.80:8546';
var Web3 = require('web3');
var web3;

// HTTTPはdeprecated
// https://web3js.readthedocs.io/en/v1.2.0/web3.html#providers
//
// exports.getWeb3Legacy = function() {
//     web3 = new Web3();
//     var ver = web3.version.split('.');
//     if ((ver[0] < 1) || (ver[1] < 0)) {
//         console.error("ERROR: need web3.version(" + web3.version + ") < 1.0");
//         process.exit(1);
//     }
//     web3.setProvider(new web3.providers.HttpProvider(PROVIDER_HTTP));
//     return web3;
// }

exports.getWeb3 = function() {
    web3 = new Web3();
    var ver = web3.version.split('.');
    if ((ver[0] < 1) || (ver[1] < 0)) {
        console.error("ERROR: need web3.version(" + web3.version + ") < 1.0");
        process.exit(1);
    }
    web3.setProvider(new web3.providers.WebsocketProvider(PROVIDER_WS));
    return web3;
}

exports.getHtlcAsync = function() {
    const fs = require('fs');
    const ABI = JSON.parse(fs.readFileSync('./build/contracts/Htlc.json', 'utf8'))['abi'];
    return new web3.eth.Contract(ABI, exports.CONTRACT_ADDR);
}
