var HonestClock = artifacts.require("./HonestClock");
var MockClock = artifacts.require("./MockClock");

module.exports = function(deployer, network, accounts) {
  var HC;

  deployer.deploy(HonestClock, {from: accounts[3]}).then((instance) => {
    HC = instance;
    HC.setPermissionLevel(accounts[1], "0x01", {from: accounts[3], gas: 80000});  //Werkstatt/Autohändler
    HC.setPermissionLevel(accounts[2], "0x02", {from: accounts[3], gas: 80000});  //TÜV
    HC.setPermissionLevel(accounts[4], "0x04", {from: accounts[3], gas: 80000});  //Fraud Detection
    })
};
