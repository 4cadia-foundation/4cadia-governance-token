const FGToken = artifacts.require('FGToken');
const FGTokenCrowdsale = artifacts.require('FGTokenCrowdsale');
const utils = require('ethers/utils');
const { BN, ether, time, expectRevert, balance } = require('@openzeppelin/test-helpers');

const { expect } = require('chai');

contract('FGToken', ([DEPLOYER, CEO, CFO, INVESTOR, OTHERINVESTOR]) => {

  const RATE = 1;
  const CAP = 100000000000;
  const maxCap = 100000000000;
 

  let openingTime;
  let closingTime;
  let afterClosingTime;
  let token;
  let crowdsale;


  describe('Crowdsale', () => {

    beforeEach('test', async () => {

      openingTime = (await time.latest()).add(time.duration.weeks(1));
      closingTime = openingTime.add(time.duration.weeks(1));

      console.log([openingTime.toString(), closingTime.toString()])

      afterClosingTime = closingTime.add(time.duration.seconds(1));


      token = await FGToken.new('FGToken', 'FGT', 8, maxCap, { from: DEPLOYER });

      crowdsale = await FGTokenCrowdsale.new(openingTime, closingTime, RATE, CAP, CFO, token.address, { from: DEPLOYER });

      await token.addCEO(CEO, { from: DEPLOYER });
      await token.addCFO(CFO, { from: CEO });
      await token.addCFO(crowdsale.address, { from: CEO });

      await token.increaseForecast(maxCap, { from: CFO });

      console.log('MAXCAP: ', maxCap);
    });

    it('should accept payments during the sale', async () => {
      const amount = ether('1');
      amount = amount

      console.log('SALE: ', amount / (Math.pow(10, 8)));

      const forecast = await token.forecast();
      const result = RATE * amount;
      console.log('FORECAST :', forecast.toString());
      console.log('RESULT :', result);

      await time.increaseTo(openingTime);
      await crowdsale.buyTokens(INVESTOR, { value: amount, from: INVESTOR });

      // MAXCAP:    100000000000
      // SALE:      1
      // FORECAST : 100000000000
      // RESULT :   100000000
      // Ehter:     10000000000000

      // // expect(await token.balanceOf(INVESTOR)).to.be.bignumber.equal(expectedTokenAmount);
      // // expect(await token.totalSupply()).to.be.bignumber.equal(expectedTokenAmount);
    });

  });

})