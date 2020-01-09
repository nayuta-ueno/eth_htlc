exports.PROVIDER = 'http://10.0.1.80:8545';
exports.CONTRACT_ADDR = '0x6A000e2Bf3539006dab909Cf6B5883Ac364271B0';
var web3;

exports.getWeb3 = function() {
    var Web3 = require('web3');
    web3 = new Web3();
    web3.setProvider(new web3.providers.HttpProvider(exports.PROVIDER));
    return web3;
}

exports.getHtlcAsync = function() {
    const fs = require('fs');
    const ABI = JSON.parse(fs.readFileSync('./build/contracts/Htlc.json', 'utf8'))['abi'];
    return new web3.eth.Contract(ABI, exports.CONTRACT_ADDR);
}
