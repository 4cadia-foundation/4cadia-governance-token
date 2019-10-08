const FGToken = artifacts.require('FGToken');

module.exports = function (deployer, network, accounts) {
  const name = 'FGToken';
  const symbol = 'FGT';
  const decimals = 8;
  const maxCap = 1000;
  deployer.deploy(FGToken, name, symbol, decimals, maxCap);
};
