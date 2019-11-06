const { BN, ether, time, expectRevert } = require('@openzeppelin/test-helpers');

const { expect } = require('chai');

const FGToken = artifacts.require('FGToken');
const FGTokenCrowdsale = artifacts.require('FGTokenCrowdsale');

contract('FGToken', ([DEPLOYER, CEO, CFO, INVESTOR, OTHERINVESTOR]) => {
  
  const RATE = new BN(1);
  const CAP = ether('50');

  let openingTime;
  let closingTime;
  let afterClosingTime;
  let token;
  let crowdsale;

  before(async function () {
    await time.advanceBlock();
  });

  beforeEach('test', async () => {

    openingTime = (await time.latest()).add(time.duration.weeks(1));
    closingTime = openingTime.add(time.duration.weeks(1));
    afterClosingTime = closingTime.add(time.duration.seconds(1));
    
    token = await FGToken.new('FGToken', 'FGT', 8, new BN(100000000000), { from: DEPLOYER });
    crowdsale = await FGTokenCrowdsale.new(openingTime, closingTime, RATE, CAP, CFO, FGToken.address, { from: DEPLOYER });

    await token.addCEO(CEO, { from: DEPLOYER });
    await token.addCFO(crowdsale.address, { from: CEO });
    await token.addCFO(CFO, { from: CEO });

    await token.increaseForecast(new BN(100000000000), { from: CFO });
    const valor = await token.forecast();
    console.log(Number(valor));
    // await token.mint(crowdsale.address, new BN(100000000000), { from: CFO });

  });

  // it('should create crowdsale with correct parameters', async () => {
  //   expect(await crowdsale.openingTime()).to.be.bignumber.equal(openingTime);
  //   expect(await crowdsale.closingTime()).to.be.bignumber.equal(closingTime);
  //   expect(await crowdsale.rate()).to.be.bignumber.equal(RATE);
  //   expect(await crowdsale.wallet()).to.equal(CFO);
  //   expect(await crowdsale.cap()).to.be.bignumber.equal(CAP);
  // });


  it('should accept payments during the sale', async function () {
    let amount = ether('1');
    amount = amount.div(10 ** 10);
    // amount = amount.div(RATE);
    const expectedTokenAmount = RATE.mul(amount);
    
     await time.increaseTo(openingTime);
    
    console.log(Number(amount));
     await crowdsale.buyTokens(INVESTOR, { value: amount, from: INVESTOR });
    // // expect(await token.balanceOf(INVESTOR)).to.be.bignumber.equal(expectedTokenAmount);
    // // expect(await token.totalSupply()).to.be.bignumber.equal(expectedTokenAmount);
  });


});