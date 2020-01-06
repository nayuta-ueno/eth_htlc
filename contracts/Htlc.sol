pragma solidity ^0.5.0;

contract Htlc {
    bytes32 paymentHash;
    address payable payer;
    uint amount;
    bool pooled;

    function poolPayment(bytes32 _paymentHash, address payable _payer, uint _amount) public {
        if (!pooled) {
            require(payer.balance > _amount, "need more balance");
            paymentHash = _paymentHash;
            payer = _payer;
            amount = _amount;
            pooled = true;
        }
    }

    function payment(bytes32 _preImage, address payable _payer) public payable {
        if (pooled) {
            require(payer == _payer, "bad payer");
            require(payer.balance > amount, "bad balance.");
            bytes32 _hash = sha256(abi.encodePacked(_preImage));
            if (_hash == paymentHash) {
                payer.transfer(amount);
                pooled = false;
            }
        }
    }

    function checkPreimage(bytes32 _preImage) public view returns(bool) {
        return sha256(abi.encodePacked(_preImage)) == paymentHash;
    }

    function isPooled() public view returns(bool) {
        return pooled;
    }

    function () external payable {}
}
