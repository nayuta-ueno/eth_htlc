const obj = artifacts.require("Htlc");

module.exports = function(deployer) {
  deployer.deploy(obj);
};
