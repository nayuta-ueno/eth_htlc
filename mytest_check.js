var mytest = require('./mytest_addr.js');
var web3 = mytest.getWeb3();

// contractに送金
async function async_func() {
    var accounts = await web3.eth.getAccounts();
    var payer = accounts[0];
    var payee = accounts[1];
    console.log("payer=" + payer);
    console.log("payee=" + payee);

    console.log("==== payer ====");
    web3.eth.defaultAccount = payer;
    var htlc = mytest.getHtlcAsync().methods;
    console.log("isPooled=" + await htlc.isPooled().call());
    console.log("isPooled(payer)=" + await htlc.isPooled(payer).call());
    console.log("isPooled(payee)=" + await htlc.isPooled(payee).call());
    console.log("getMinimumTimeout()=" + await htlc.getMinimumTimeout().call());

    console.log("\n==== payee ====");
    web3.eth.defaultAccount = payee;
    var htlc = mytest.getHtlcAsync().methods;
    console.log("isPooled=" + await htlc.isPooled().call());
    console.log("isPooled(payer)=" + await htlc.isPooled(payer).call());
    console.log("isPooled(payee)=" + await htlc.isPooled(payee).call());
    console.log("getMinimumTimeout()=" + await htlc.getMinimumTimeout().call());
}
async_func();
