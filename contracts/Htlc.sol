pragma solidity ^0.5.0;

contract Htlc {
    struct HtlcData {
        bytes32 paymentHash;        ///< paymentHash
        address payable payee;      ///< 送金先
        uint amount;                ///< 送金額
        uint height;                ///< poolしたときのblockNumber
        uint delay;                 ///< タイムアウトするblock
        bool pooled;                ///< true:pool済み
    }

    //msg.senderは1つだけしかHTLCを作ることができないことにする
    mapping(address => HtlcData) htlcData;

    //msg.senderがpayer
    function poolPayment(bytes32 _paymentHash, address payable _payee, uint _amount, uint _delay) public {
        if (!htlcData[msg.sender].pooled) {
            require(msg.sender.balance > _amount, "need more balance");
            htlcData[msg.sender].paymentHash = _paymentHash;
            htlcData[msg.sender].payee = _payee;
            htlcData[msg.sender].amount = _amount;
            htlcData[msg.sender].height = block.number; //miningされたときのblockNumberになるようだ
            htlcData[msg.sender].delay = _delay;
            htlcData[msg.sender].pooled = true;
        }
    }

    //引数でpayeeを取っているのは、一応チェックをしているというだけで意味はそんなに無い
    //set系は戻り値がどうやってもtxになる
    function payment(bytes32 _preImage, address payable _payee) public payable {
        if (htlcData[msg.sender].pooled) {
            require(htlcData[msg.sender].payee == _payee, "unknown payee");
            require(msg.sender.balance > htlcData[msg.sender].amount, "bad balance.");
            bytes32 _hash = sha256(abi.encodePacked(_preImage));
            if (_hash == htlcData[msg.sender].paymentHash) {
                htlcData[msg.sender].payee.transfer(htlcData[msg.sender].amount);
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

    //自分がpayeeになっているかどうか
    function isPooled(address _payee) public view returns(bool) {
        return htlcData[_payee].payee == msg.sender;
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
