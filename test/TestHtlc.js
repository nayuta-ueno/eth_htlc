const Htlc = artifacts.require("Htlc");

contract("Htlc", async accounts => {
    it("pool", async () => {
        var htlc = await Htlc.deployed();
        await web3.eth.sendTransaction({ from: accounts[0], to: htlc.address, value: 1000000 });

        assert.isFalse(await htlc.isPooled(), "deployed");

        var height = await web3.eth.getBlockNumber();

        //sha256(001122334455667788990011223344556677889900112233445566778899aabb)
        //-->0f21c51a169a3a60dcd7a5e9ca0aead03027e3c3d36646d992145becfcf1d8d8
        await htlc.poolPayment(
            "0x0f21c51a169a3a60dcd7a5e9ca0aead03027e3c3d36646d992145becfcf1d8d8",
            accounts[0], 10000, 2);

        assert.isTrue(await htlc.isPooled(), "poolPayment");
        assert.equal(await web3.eth.getBlockNumber(), height + 1, "1block");
        assert.equal(await htlc.getMinimumTimeout(), height + 1 + 2 + 1, "timeout");
    });

    it("pay", async () => {
        var htlc = await Htlc.deployed();

        //sha256(001122334455667788990011223344556677889900112233445566778899aabb)
        //-->0f21c51a169a3a60dcd7a5e9ca0aead03027e3c3d36646d992145becfcf1d8d8
        // var bal = await web3.eth.getBalance(accounts[0]);
        // console.log("bal=" + bal);

        assert.isTrue(await htlc.isPooled(), "poolPayment");

        var preimage = "0x001122334455667788990011223344556677889900112233445566778899aabb";

        var ret = await htlc.checkPreimage(preimage);
        assert.isTrue(ret, "checkPreimage");

        try {
            await htlc.payment(preimage, accounts[0]);
        } catch (err) {
            console.log("err=" + err);
            assert.isTrue(false);
        }
        // bal = await web3.eth.getBalance(accounts[0]);
        // console.log("bal2=" + bal);

        assert.isFalse(await htlc.isPooled(), "payment");
    });

    it("withdraw", async () => {
        var htlc = await Htlc.deployed();

        var height = await web3.eth.getBlockNumber();
        await htlc.poolPayment(
            "0x0f21c51a169a3a60dcd7a5e9ca0aead03027e3c3d36646d992145becfcf1d8d8",
            accounts[0], 10000, 2);
        assert.isTrue(await htlc.isPooled(), "poolPayment");
        assert.equal(await web3.eth.getBlockNumber(), height + 1, "1block");
        assert.equal(await htlc.getMinimumTimeout(), height + 1 + 2 + 1, "timeout");

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

        assert.isTrue(await htlc.isPooled(), "failPayment");
        assert.equal(await web3.eth.getBlockNumber(), height + 2, "2block");

        try {
            await htlc.withdraw();
            assert.isTrue(false);
        } catch (err) {
            //fail withdrawn
        }

        //await web3.eth.sendTransaction({from:accounts[0], to:accounts[0], value:1});
        assert.equal(await web3.eth.getBlockNumber(), height + 3, "3block");
        try {
            await htlc.withdraw();
        } catch (err) {
            //fail withdrawn
            assert.isTrue(false);
        }

        assert.isFalse(await htlc.isPooled(), "withdraw");
    });
});
