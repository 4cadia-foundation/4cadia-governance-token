const FGToken = artifacts.require('FGToken');
const FGTokenCrowdsale = artifacts.require('FGTokenCrowdsale');

function latestTime () {
  return web3.eth.getBlock('latest').timestamp;
}

const duration = {
  seconds: function (val) { return val; },
  minutes: function (val) { return val * this.seconds('60'); },
  hours: function (val) { return val * this.minutes('60'); },
  days: function (val) { return val * this.hours('24'); },
  weeks: function (val) { return val * this.days('7'); },
  years: function (val) { return val * this.days('365');},
};

module.exports = async (deployer, network, accounts) => {
  
  const BigNumber = web3.BigNumber;
  const RATE = new BigNumber(1);
  const startTime = latestTime() + duration.weeks(1);
  const endTime = startTime + duration.weeks(1);
  console.log([startTime, endTime, RATE.toNumber(), accounts[0]]);
 
  await deployer.deploy(FGToken, 'FGToken', 'FGT', 8, 1000);
  await deployer.deploy(FGTokenCrowdsale, 1, '0x2aca7f45a401cdd40ac745248272270095f69ba4', FGToken.address);
};
