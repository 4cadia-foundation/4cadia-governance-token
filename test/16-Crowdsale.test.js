const FGToken = artifacts.require('FGToken');
const FGTokenCrowdsale = artifacts.require('FGTokenCrowdsale');
const truffleAssertions = require('truffle-assertions');
const { BN, ether } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

contract('FGToken', ([_, DEPLOYER, CEO, CFO, INVESTOR, OTHERINVESTOR]) => {

  const maxCap = 100000000000;
  
  const rate = 1;
  let token;
  let crowdsale;

  describe('Crowdsale', () => {

    beforeEach('test', async () => {

      token = await FGToken.new('FGToken', 'FGT', 8, maxCap, { from: DEPLOYER });

      crowdsale = await FGTokenCrowdsale.new(rate, CFO, token.address, { from: DEPLOYER });

      await token.addCEO(CEO, { from: DEPLOYER });
      await token.addCFO(CFO, { from: CEO });
      await token.addCFO(crowdsale.address, { from: CEO });

      await token.increaseForecast(maxCap, { from: CFO });
      await token.mint(crowdsale.address, maxCap, { from: CFO });
    });

    it('should accept payments during the sale', async () => {
      const amount = ether('1');
      const expectedTokenAmount = new BN(amount / (Math.pow(10, 10)));
      await truffleAssertions.passes(crowdsale.buyTokens(INVESTOR, { value: amount, from: INVESTOR }));
      expect(await token.balanceOf(INVESTOR)).to.be.bignumber.equal(expectedTokenAmount);
    });

  });
});