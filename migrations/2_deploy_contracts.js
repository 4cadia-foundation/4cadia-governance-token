const FGToken = artifacts.require('FGToken');
const FGTokenCrowdsale = artifacts.require('FGTokenCrowdsale');
const { BN, ether, time } = require('@openzeppelin/test-helpers');


module.exports = async (deployer, network, accounts) => {
  const name = 'FGToken';
  const symbol = 'FGT';
  const decimals = 8;
  const maxCap = 1000 * 10 ** decimals;
<<<<<<< HEAD
  const rate = 1;
  const wallet = '0x2aca7f45a401cdd40ac745248272270095f69ba4';

  await deployer.deploy(FGToken, name, symbol, decimals, maxCap);
  await deployer.deploy(FGTokenCrowdsale, rate, wallet, FGToken.address);
 
=======
  const forecastDuration = 7;
  deployer.deploy(FGToken, name, symbol, decimals, maxCap, forecastDuration);
>>>>>>> develop
};
