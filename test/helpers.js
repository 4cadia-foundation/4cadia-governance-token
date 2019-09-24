const BigNumber = require('bignumber.js');

const should = require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BigNumber))
    .should();

const expect = require('chai').expect;

module.exports = { should, expect };