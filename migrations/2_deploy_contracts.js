const FGToken = artifacts.require('FGToken');
const CrowdsaleContract = artifacts.require('Crowdsale');

module.exports = async (deployer, network, accounts) => {
  await deployer.deploy(FGToken, 'FGToken', 'FGT', 8, 1000);
  await deployer.deploy(CrowdsaleContract, 1, '0x2aca7f45a401cdd40ac745248272270095f69ba4', FGToken.address);
};
