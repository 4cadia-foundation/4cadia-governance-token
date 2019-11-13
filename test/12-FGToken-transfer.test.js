const helpers = require('./helpers');
const FGToken = artifacts.require('FGToken');
const BalanceContract = artifacts.require('BalanceContract');
const truffleAssertions = require('truffle-assertions');

const { name, symbol, decimals, maxCap, forecastAmount, amount, data, empty, forecastDuration } = require('./helpers');  


contract('FGToken', accounts => {

  let token;
  let listAccounts = helpers.parseAccounts(accounts);

  beforeEach('test', async () => {
    token = await FGToken.new(name, symbol, decimals, maxCap, forecastDuration, { from: listAccounts.CEO });
    await token.addCFO(listAccounts.CFO, { from: listAccounts.CEO });
    await token.increaseForecast(forecastAmount, { from: listAccounts.CFO });
    await token.mint(listAccounts.CFO, amount, { from: listAccounts.CFO });
  });

  describe('transfer', () => {

    it('transfer success', async () => {
      await truffleAssertions.passes(token.transfer(listAccounts.User, amount, empty, { from: listAccounts.CFO }));
    });
    
    it('totalSupply do not change after transfer', async () => {
      const totalSupplyBefore = await token.totalSupply();
      await token.transfer(listAccounts.User, amount, empty, { from: listAccounts.CFO });
      const totalSupplyAfter = await token.totalSupply();      
      assert.equal(Number(totalSupplyBefore), Number(totalSupplyAfter));
    });

    it('should substract amount the balances of `from` account', async () => {
      const initialBalance = await token.balanceOf(listAccounts.CFO);
      await token.transfer(listAccounts.User, amount, empty, { from: listAccounts.CFO });
      const resultBalance = await token.balanceOf(listAccounts.CFO);
      assert.equal(initialBalance.toNumber(), resultBalance.toNumber() + amount, 'wrong balance after transfer');
    });

    it('should add amount for balance of `to` account', async () => {
      const initialBalance = await token.balanceOf(listAccounts.User);
      await token.transfer(listAccounts.User, amount, empty, { from: listAccounts.CFO });
      const resultBalance = await token.balanceOf(listAccounts.User);
      assert.equal(initialBalance.toNumber() + amount, resultBalance.toNumber(), 'wrong balance after transfer');
    });

    it('forecast do not change after transfer', async () => {
      var forecastBefore = await token.forecast();
      await token.transfer(listAccounts.User, amount, empty, { from: listAccounts.CFO });
      var forecastAfter = await token.forecast();
      assert.equal(Number(forecastBefore), Number(forecastAfter));
    });

    it('maxCap do not change after transfer', async () => {
      var maxCapBefore = await token.maxCap();
      await token.transfer(listAccounts.User, amount, empty, { from: listAccounts.CFO });
      var maxCapAfter = await token.maxCap();      
      assert.equal(Number(maxCapBefore), Number(maxCapAfter));
    });

    it('transfer revert if value is greater than balance', async () => {
      var balance = await token.balanceOf(listAccounts.CFO);
      var value = balance + 1;
      //await truffleAssertions.fails(token.transfer(listAccounts.User, value, empty, { from: listAccounts.CFO }), 'insuficient funds');
      await truffleAssertions.reverts(token.transfer(listAccounts.User, value, empty, { from: listAccounts.CFO }), 'insuficient funds');
    });

    it('transfer should fails when token is paused', async () => {
      await token.pause({ from: listAccounts.CEO });
      await truffleAssertions.fails(token.transfer(listAccounts.User, amount, empty, { from: listAccounts.CFO }), 'Pausable: paused');
    });    

    it('should emit event Transfer', async () => {
      const transaction = await token.transfer(listAccounts.User, amount, empty, { from: listAccounts.CFO });
      await truffleAssertions.eventEmitted(transaction, 'Transfer',      
        event => event.from === listAccounts.CFO && event.to === listAccounts.User && Number(event.value) === amount);
    });
  });

  describe('transfer to contract', () => {
    it('transfer of the ERC223 tokens to a contract implementing the ERC223 fallback should succeed', async () => {
      const balanceContract = await BalanceContract.new();
      await truffleAssertions.passes( token.transfer(balanceContract.address, amount, data, { from: listAccounts.CFO }) );
    });
    
    it('should amount od tokens must be in tokenFallback contract', async () => {
      const balanceContract = await BalanceContract.new();
      await token.transfer(balanceContract.address, amount, data, { from: listAccounts.CFO });
      const valueReceiver = await balanceContract.value();
      expect(Number(valueReceiver)).to.equal(amount);
    });

    it('should identify who send tokens in tokenFallback contract', async () => {
      const balanceContract = await BalanceContract.new();
      await token.transfer(balanceContract.address, amount, data, { from: listAccounts.CFO });
      const fromReceiver = await balanceContract.from();
      expect(fromReceiver).to.equal(listAccounts.CFO);
    }); 
    
  });


});
