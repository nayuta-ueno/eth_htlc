# 使い方

## install

* geth
  * gethでPoAの設定などはこちらを見て立てよう。
    https://scrapbox.io/nayuta/ueno_-_ethereum%E5%AD%A6%E7%BF%92
  * gethがいるかどうかわからん。truffle developで十分か。
  * truffleのweb3はv0.4系かもしれないので注意しよう。

```bash
$ sudo add-apt-repository -y ppa:ethereum/ethereum
$ sudo apt update
$ sudo apt install ethereum
```

* truffleとopen zeppelin

```bash
$ npm install truffle -g
$ npm install @openzeppelin/contracts -g

$ truffle version
 Truffle v5.1.5 (core: 5.1.5)
 Solidity v0.5.12 (solc-js)
 Node v13.5.0
 Web3.js v1.2.1
```

nodeはnvmでインストールした方がよさそうだった。  


## deploy

```bash
$ git clone git@github.com:nayuta-ueno/eth_htlc.git
$ cd eth_htlc
$ npm install web3
```

truffle-config.jsを変更してgethにつないでも良いし、developでいいかもしれん。

```bash
$ truffle deploy
```


## node

* mytest_addr.jsに接続先が載っているので、状況に合わせよう。

```bash
# preimageが"0011223..899aabb"のインスタンスを投げる
node mytest1.js

# preimageを使って取り戻す
node mytest2.js
```
