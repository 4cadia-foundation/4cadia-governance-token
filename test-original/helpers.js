const BigNumber = require('bignumber.js');
const ContractToken = artifacts.require('FGToken');

const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const expect = require('chai').expect;

const parseAccounts = (list) => {
  return {
    OWNER: list[0],
    CEO: list[1],
    CFO: list[2],
    ALPHA: list[3],
    BETA: list[4],
    GAMMA: list[5],
    NOTOWNER: list[6]
  };
};

const descriptionSample = () => {
  return new Uint8Array([83, 97, 109, 112, 108, 101, 32, 68, 97, 116, 97]);
};

const instanceContract = async (list) => {
  const accounts = parseAccounts(list);
  const contract = await ContractToken.new('FGToken', 'FGT', 8, 1000, { from: accounts.OWNER });
  await contract.addCEO(accounts.CEO, { from: accounts.OWNER });
  await contract.addCFO(accounts.CFO, { from: accounts.CEO });
  return contract;
};

module.exports = { should, expect, instanceContract, parseAccounts, descriptionSample };
