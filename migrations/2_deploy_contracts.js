const FGToken = artifacts.require('FGToken');
const FGTokenCrowdsale = artifacts.require('FGTokenCrowdsale');
const { BN, ether, time } = require('@openzeppelin/test-helpers');


module.exports = async (deployer, network, accounts) => {
  const name = 'FGToken';
  const symbol = 'FGT';
  const decimals = 8;
  const maxCap = 1000 * 10 ** decimals;
  const wallet = '0x2aca7f45a401cdd40ac745248272270095f69ba4';

  const RATE = new BN(1);
  const CAP = ether('20');

  const openingTime = (await time.latest()).add(time.duration.weeks(1));
  const closingTime = openingTime.add(time.duration.weeks(1));

  await deployer.deploy(FGToken, name, symbol, decimals, maxCap);
  await deployer.deploy(FGTokenCrowdsale, openingTime, closingTime, RATE, CAP, wallet, FGToken.address);
 
};
