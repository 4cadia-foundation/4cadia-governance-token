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
    User2: list[8]
  };
};

const name = 'FGToken';
const symbol = 'FGT';
const decimals = 8;
const maxCap = 1000 * 10 ** decimals;
const forecastAmount = 200 * 10 ** decimals;
const amount = 100 * 10 ** decimals;
const data = new Uint8Array([83, 97, 109, 112, 108, 101, 32, 68, 97, 116, 97]);
const empty = new  Uint8Array([0]);
const forecastDuration = 7;

module.exports = { should, expect, parseAccounts, name, symbol, decimals, maxCap, forecastAmount, amount, data, empty, forecastDuration };
