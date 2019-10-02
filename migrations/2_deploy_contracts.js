const FGToken = artifacts.require('FGToken');

module.exports = function (deployer, network, accounts) {
  const _name = 'FGToken';
  const _symbol = 'FGT';
  const _decimals = 8;
  const _initialSupply = 0;
  deployer.deploy(FGToken, _name, _symbol, _decimals, _initialSupply);
};
