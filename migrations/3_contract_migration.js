const BalanceContract = artifacts.require("./BalanceContract.sol");

module.exports = async function(deployer) {
  await deployer.deploy(BalanceContract)
  await BalanceContract.deployed()
};