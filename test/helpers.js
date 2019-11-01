const BigNumber = require('bignumber.js');

const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const expect = require('chai').expect;

const parseAccounts = (list) => {
  return {
    Creator: list[0],
    OtherAddress: list[1],
    CEO: list[2],
    CFO: list[3],
    MaxCapManager: list[4],
    Compliance: list[5],
    Whitelisted: list[6],
    User: list[7],

    OWNER: list[0],
    NOTOWNER: list[1],
    ALPHA: list[7],
    BETA: list[8],
    GAMMA: list[9],
  };
};


module.exports = { should, expect, parseAccounts  };
