const FGToken = artifacts.require('FGToken');

module.exports = function (deployer, network, accounts) {
  const name = 'FGToken';
  const symbol = 'FGT';
  const decimals = 8;
  const maxCap = 1000 * 10 ** decimals;
  const forecastDuration = 7;
  deployer.deploy(FGToken, name, symbol, decimals, maxCap, forecastDuration);
};
