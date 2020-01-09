var mytest = require('./mytest_addr.js');
var web3 = mytest.getWeb3();

// contractに送金
async function async_func() {
    console.log('gas Price: ' + await web3.eth.getGasPrice());
    console.log('balance of contract_addr=' + await web3.eth.getBalance(mytest.CONTRACT_ADDR));

    const accounts = await web3.eth.getAccounts();
    var payer = accounts[0];
    var payee = accounts[1];
    console.log("payer=" + payer);
    console.log("payee=" + payee);

    var htlc = mytest.getHtlcAsync().methods;

    //sha256(001122334455667788990011223344556677889900112233445566778899aabb)
    //-->0f21c51a169a3a60dcd7a5e9ca0aead03027e3c3d36646d992145becfcf1d8d8
    var preimage = "0x001122334455667788990011223344556677889900112233445566778899aabb";
    try {
        tx = await htlc.payment(preimage, payee).send({from: payer});
        console.log("payment=");
        console.dir(tx);
    } catch (err) {
        console.log("err=" + err);
        assert.isTrue(false);
    }
}
async_func();
