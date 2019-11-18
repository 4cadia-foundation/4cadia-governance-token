const FGToken = artifacts.require('FGToken');
const FGTokenCrowdsale = artifacts.require('FGTokenCrowdsale');
const truffleAssertions = require('truffle-assertions');
const { BN, ether, expectRevert } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS} = require('@openzeppelin/test-helpers/src/constants');
const { expect } = require('chai');

contract('FGToken', ([_, DEPLOYER, CEO, CFO, INVESTOR, OTHERINVESTOR]) => {

  const maxCap = 100000000000;

  const rate = 1;
  const forecastDuration = 7;
  let token;
  let crowdsale;

  describe('Crowdsale', () => {

    beforeEach('test', async () => {

      token = await FGToken.new('FGToken', 'FGT', 8, maxCap, forecastDuration, { from: DEPLOYER });

      crowdsale = await FGTokenCrowdsale.new(rate, CFO, token.address, { from: DEPLOYER });

      await token.addCEO(CEO, { from: DEPLOYER });
      await token.addCFO(CFO, { from: CEO });
      await token.addCFO(crowdsale.address, { from: CEO });

      await token.increaseForecast(maxCap, { from: CFO });
      await token.mint(crowdsale.address, maxCap, { from: CFO });
    });

    it('should accept payments during the sale', async () => {
      const amount = ether('1');
      const expectedTokenAmount = new BN((amount * 184) / (Math.pow(10, 10)));
      await truffleAssertions.passes(crowdsale.buyTokens(INVESTOR, { value: amount, from: INVESTOR }));
      expect(await token.balanceOf(INVESTOR)).to.be.bignumber.equal(expectedTokenAmount);
    });

    it('should revert operation, balance cannot be less than a token', async () => {
      await expectRevert(crowdsale.buyTokens(INVESTOR, { value: ether('0.000000000000000001'), from: INVESTOR }), 'Operation balance cannot be less than one token');
    });

    it('should fails beneficiary is the zero address', async () => {
      await truffleAssertions.fails(crowdsale.buyTokens(ZERO_ADDRESS, { value: ether('1'), from: INVESTOR }), 'Crowdsale: beneficiary is the zero address');
    });

    it('should fails weiAmount is 0', async () => {
      await truffleAssertions.fails(crowdsale.buyTokens(INVESTOR, { value: 0, from: INVESTOR }), 'Crowdsale: weiAmount is 0');
    });


  });
});