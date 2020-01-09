const mytest = require('./mytest_addr.js');
var web3 = mytest.getWeb3();

// contractに送金
async function async_func() {
    //console.log('Protocol Version: ' + await web3.eth.getProtocolVersion());
    console.log('gas Price: ' + await web3.eth.getGasPrice());
    console.log('balance of contract_addr=' + await web3.eth.getBalance(mytest.CONTRACT_ADDR));

    //show bytecode
    // var bc = await web3.eth.getCode(mytest.CONTRACT_ADDR);
    // console.dir(bc);

    const accounts = await web3.eth.getAccounts();
    var payer = accounts[0];
    var payee = accounts[1];
    console.log("payer=" + payer);
    console.log("payee=" + payee);
    await web3.eth.sendTransaction({ from: payer, to: mytest.CONTRACT_ADDR, value: 1000000 });

    var htlc = mytest.getHtlcAsync().methods;
    // console.log("htlc");
    // console.dir(htlc);

    //sha256(001122334455667788990011223344556677889900112233445566778899aabb)
    //-->0f21c51a169a3a60dcd7a5e9ca0aead03027e3c3d36646d992145becfcf1d8d8
    var tx = await htlc.poolPayment(
        "0x0f21c51a169a3a60dcd7a5e9ca0aead03027e3c3d36646d992145becfcf1d8d8",
        payee, 10000, 200).send({from: payer});
    console.log("poolPayment= ");
    console.dir(tx);
}
async_func();
