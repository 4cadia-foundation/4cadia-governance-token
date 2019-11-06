const FGToken = artifacts.require('FGToken');
const FGTokenCrowdsale = artifacts.require('FGTokenCrowdsale');
const { BN, ether, time } = require('@openzeppelin/test-helpers');

module.exports = async (deployer, network, [wallet]) => {
  const RATE = new BN(10);
  const CAP = ether('20');

  const openingTime = (await time.latest()).add(time.duration.weeks(1));
  const closingTime = openingTime.add(time.duration.weeks(1));

  await deployer.deploy(FGToken, 'FGToken', 'FGT', 8, 100000000000);
  await deployer.deploy(FGTokenCrowdsale, openingTime, closingTime, RATE, CAP, wallet, FGToken.address);
};
