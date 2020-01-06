const Htlc = artifacts.require("Htlc");

contract("Htlc", async accounts => {
  it("pool", async () => {
    var htlc = await Htlc.deployed();

    assert.isFalse(await htlc.isPooled(), "deployed");

    //sha256(001122334455667788990011223344556677889900112233445566778899aabb)
    //-->0f21c51a169a3a60dcd7a5e9ca0aead03027e3c3d36646d992145becfcf1d8d8
    await htlc.poolPayment("0x0f21c51a169a3a60dcd7a5e9ca0aead03027e3c3d36646d992145becfcf1d8d8", accounts[0], 10000);

    assert.isTrue(await htlc.isPooled(), "poolPayment");
  });

  it("pay", async () => {
    var htlc = await Htlc.deployed();

    await web3.eth.sendTransaction({from:accounts[0], to:htlc.address, value:1000000});

    //sha256(001122334455667788990011223344556677889900112233445566778899aabb)
    //-->0f21c51a169a3a60dcd7a5e9ca0aead03027e3c3d36646d992145becfcf1d8d8
    // var bal = await web3.eth.getBalance(accounts[0]);
    // console.log("bal=" + bal);

    var pooled = await htlc.isPooled();
    assert.isTrue(pooled, "poolPayment");
    // console.log("pooled=" + pooled);

    var preimage = "0x001122334455667788990011223344556677889900112233445566778899aabb";

    var ret = await htlc.checkPreimage(preimage);
    // console.log("ret=" + ret);
    assert.isTrue(ret, "checkPreimage");
    try {
        await htlc.payment(preimage, accounts[0]);
    } catch (err) {
        console.log("err=" + err);
        assert.isTrue(false);
    }
    // bal = await web3.eth.getBalance(accounts[0]);
    // console.log("bal2=" + bal);

    pooled = await htlc.isPooled();
    assert.isFalse(pooled, "payment");
    // console.log("pooled=" + pooled);

    await htlc.poolPayment("0x0f21c51a169a3a60dcd7a5e9ca0aead03027e3c3d36646d992145becfcf1d8d8", accounts[0], 10000);
    pooled = await htlc.isPooled();
    assert.isTrue(pooled, "poolPayment");
    // console.log("pooled=" + pooled);

    preimage = "0x000122334455667788990011223344556677889900112233445566778899aabb";
    ret = await htlc.checkPreimage(preimage);
    assert.isFalse(ret, "checkPreimage");

    try {
        await htlc.payment(preimage, accounts[0]);
        assert.isTrue(false);
    } catch (err) {
        //fail payment
        //console.log("err=" + err);
    }
    // bal = await web3.eth.getBalance(accounts[0]);
    // console.log("bal2=" + bal);

    pooled = await htlc.isPooled();
    assert.isTrue(pooled, "failPayment");
    // console.log("pooled=" + pooled);
  });

});
