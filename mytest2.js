const PROVIDER = 'http://10.0.1.80:8545';
const CONTRACT_ADDR = '0x9fa77592Ffb501BB69d1de878B8187085Ccb53f7';

const fs = require('fs');
var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(PROVIDER));

// contractに送金
async function async_func() {
    console.log('Protocol Version: ' + await web3.eth.getProtocolVersion());
    console.log('gas Price: ' + await web3.eth.getGasPrice());
    console.log('balance of contract_addr=' + await web3.eth.getBalance(CONTRACT_ADDR));

    //ABI
    const ABI = JSON.parse(fs.readFileSync('./build/contracts/Htlc.json', 'utf8'))['abi'];
    var htlc = new web3.eth.Contract(ABI, CONTRACT_ADDR);

	let accounts = await web3.eth.getAccounts();
    var payer = accounts[0];
    var payee = accounts[1];
    console.log("payer=" + payer);
    console.log("payee=" + payee);

    //sha256(001122334455667788990011223344556677889900112233445566778899aabb)
    //-->0f21c51a169a3a60dcd7a5e9ca0aead03027e3c3d36646d992145becfcf1d8d8
    var preimage = "0x001122334455667788990011223344556677889900112233445566778899aabb";
    try {
        await htlc.methods.payment(preimage, payee).send({from: payer});
    } catch (err) {
        console.log("err=" + err);
        assert.isTrue(false);
    }
}
async_func();
