pragma solidity ^0.5.0;

contract Htlc {
    struct HtlcData {
        bytes32 paymentHash;
        address payable payer;
        uint amount;
        uint height;
        uint delay;
        bool pooled;
    }
    mapping(address => HtlcData) htlcData;

    function poolPayment(bytes32 _paymentHash, address payable _payer, uint _amount, uint _delay) public {
        if (!htlcData[msg.sender].pooled) {
            require(msg.sender.balance > _amount, "need more balance");
            htlcData[msg.sender].paymentHash = _paymentHash;
            htlcData[msg.sender].payer = _payer;
            htlcData[msg.sender].amount = _amount;
            htlcData[msg.sender].height = block.number; //miningされたときのblockNumberになるようだ
            htlcData[msg.sender].delay = _delay;
            htlcData[msg.sender].pooled = true;
        }
    }

    //set系は戻り値がどうやってもtxになる
    function payment(bytes32 _preImage, address payable _payer) public payable {
        if (htlcData[msg.sender].pooled) {
            require(htlcData[msg.sender].payer == _payer, "bad payer");
            require(msg.sender.balance > htlcData[msg.sender].amount, "bad balance.");
            bytes32 _hash = sha256(abi.encodePacked(_preImage));
            if (_hash == htlcData[msg.sender].paymentHash) {
                htlcData[msg.sender].payer.transfer(htlcData[msg.sender].amount);
                htlcData[msg.sender].pooled = false;
            }
        }
    }

    function withdraw() public {
        if ( htlcData[msg.sender].pooled &&
             (block.number - htlcData[msg.sender].height > htlcData[msg.sender].delay)) {
            htlcData[msg.sender].pooled = false;
        } else {
            assert(false);
        }
    }

    function checkPreimage(bytes32 _preImage) public view returns(bool) {
        if (htlcData[msg.sender].pooled) {
            return sha256(abi.encodePacked(_preImage)) == htlcData[msg.sender].paymentHash;
        } else {
            return false;
        }
    }

    function isPooled() public view returns(bool) {
        return htlcData[msg.sender].pooled;
    }

    function getMinimumTimeout() public view returns(uint) {
        if (htlcData[msg.sender].pooled) {
            return htlcData[msg.sender].height + htlcData[msg.sender].delay + 1;
        } else {
            return 0;
        }
    }

    function () external payable {}
}
