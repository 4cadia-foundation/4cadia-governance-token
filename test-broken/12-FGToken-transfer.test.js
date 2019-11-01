const helpers = require('./helpers');
const FGToken = artifacts.require('FGToken');
const truffleAssertions = require('truffle-assertions');

const {
  name, symbol, decimals, maxCap
} = require('./dataTest');  

const forecastAmount = 200 * 10 ** decimals;
const amount = 100 * 10 ** decimals;

contract('FGToken', accounts => {

  let token;
  let listAccounts = helpers.parseAccounts(accounts);

  beforeEach('test', async () => {
    token = await FGToken.new(name, symbol, decimals, maxCap, { from: listAccounts.CEO });
    await token.addCFO(listAccounts.CFO, { from: listAccounts.CEO });
    await token.increaseForecast(forecastAmount, { from: listAccounts.CFO });
    await token.mint(listAccounts.CFO, amount, { from: listAccounts.CFO });
  });

  describe('transfer', () => {

    it('transfer success', async () => {
      await truffleAssertions.passes(token.transfer(listAccounts.User, amount, { from: listAccounts.CFO }));
    });
    
    it('totalSupply do not change after transfer', async () => {
      var totalSupplyBefore = await token.totalSupply();
      await token.transfer(listAccounts.User, amount, { from: listAccounts.CFO });
      var totalSupplyAfter = await token.totalSupply();      
      assert.equal(Number(totalSupplyBefore), Number(totalSupplyAfter));
    });

    it('check balance after transfer', async () => {
      var balanceOfBefore = await token.balanceOf(listAccounts.User);
      await token.transfer(listAccounts.User, amount, { from: listAccounts.CFO });
      var balanceOfAfter = await token.balanceOf(listAccounts.User);      
      assert.equal(Number(balanceOfBefore + amount), Number(balanceOfAfter));
    });

    it('forecast do not change after transfer', async () => {
      var forecastBefore = await token.forecast();
      await token.transfer(listAccounts.User, amount, { from: listAccounts.CFO });
      var forecastAfter = await token.forecast();
      assert.equal(Number(forecastBefore), Number(forecastAfter));
    });

    it('maxCap do not change after transfer', async () => {
      var maxCapBefore = await token.maxCap();
      await token.transfer(listAccounts.User, amount, { from: listAccounts.CFO });
      var maxCapAfter = await token.maxCap();      
      assert.equal(Number(maxCapBefore), Number(maxCapAfter));
    });

    it('transfer failed if value is greater than balance', async () => {
      var balance = await token.balanceOf(listAccounts.CFO);
      var value = balance + 1;
      await truffleAssertions.fails(token.transfer(listAccounts.User, value, { from: listAccounts.CFO }), 'insuficient funds');
    });

    it('transfer should fails when token is paused', async () => {
      await token.pause({ from: listAccounts.CEO });
      await truffleAssertions.fails(token.transfer(listAccounts.User, amount, { from: listAccounts.CFO }), 'Pausable: paused');
    });    

    it('should emit event Transfer when transfer', async () => {
      const transaction = await token.transfer(listAccounts.User, amount, { from: listAccounts.CFO });
      await truffleAssertions.eventEmitted(transaction, 'Transfer',      
        event => event.from === listAccounts.CFO && event.to === listAccounts.User && Number(event.value) === amount);
    });

    /* transfer ERC223
    const data = new Uint8Array([83, 97, 109, 112, 108, 101, 32, 68, 97, 116, 97]);
    
    it('transfer of the ERC223 tokens to a balance contract implementing the ERC223 fallback should succeed', async () => {
      const balanceContract = await BalanceContract.new({ from: accountAlpha });
      await this.token.transfer(balanceContract.address, 100, data, { from: accountCFO });
      expect(Number(await balanceContract.value())).to.equal(100);
    });    
    */

  });


});
