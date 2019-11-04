const helpers = require('./helpers');
const FGToken = artifacts.require('FGToken');
const truffleAssertions = require('truffle-assertions');

const {
  name, symbol, decimals, maxCap, forecastAmount, amount
} = require('./helpers');  


contract('FGToken', accounts => {

  let token;
  let listAccounts = helpers.parseAccounts(accounts);

  beforeEach('test', async () => {
    token = await FGToken.new(name, symbol, decimals, maxCap, { from: listAccounts.CEO });
    await token.addCFO(listAccounts.CFO, { from: listAccounts.CEO });
    await token.increaseForecast(forecastAmount, { from: listAccounts.CFO });
    await token.mint(listAccounts.CFO, amount, { from: listAccounts.CFO });
  });

  describe('burn', () => {

    it('burn success', async () => {
      await truffleAssertions.passes(token.burn(amount, { from: listAccounts.CFO }));
    });

    it('should fail if account not isCFORole', async () => {
      await token.mint(listAccounts.OtherAddress, amount, { from: listAccounts.CFO });
      await truffleAssertions.fails(token.burn(amount, { from: listAccounts.OtherAddress }), 'CFORole: onlyCFO');
    });    
    
    it('check totalSupply after burn', async () => {
      var totalSupplyBefore = await token.totalSupply();
      await token.burn(amount, { from: listAccounts.CFO });
      var totalSupplyAfter = await token.totalSupply();      
      assert.equal(Number(totalSupplyBefore), Number(totalSupplyAfter + amount));
    });

    it('check balance after burn', async () => {
      var balanceOfBefore = await token.balanceOf(listAccounts.CFO);
      await token.burn(amount, { from: listAccounts.CFO });
      var balanceOfAfter = await token.balanceOf(listAccounts.CFO);      
      assert.equal(Number(balanceOfBefore), Number(balanceOfAfter + amount));
    });

    it('forecast do not change after burn', async () => {
      var forecastBefore = await token.forecast();
      await token.burn(amount, { from: listAccounts.CFO });
      var forecastAfter = await token.forecast();
      assert.equal(Number(forecastBefore), Number(forecastAfter));
    });

    it('maxCap do not change after burn', async () => {
      var maxCapBefore = await token.maxCap();
      await token.burn(amount, { from: listAccounts.CFO });
      var maxCapAfter = await token.maxCap();      
      assert.equal(Number(maxCapBefore), Number(maxCapAfter));
    });

    it('burn failed if value is greater than balance', async () => {
      var balance = await token.balanceOf(listAccounts.CFO);
      var value = balance + 1;
      await truffleAssertions.fails(token.burn(value, { from: listAccounts.CFO }), 'insuficient funds');
    });

    it('burn should fails when token is paused', async () => {
      await token.pause({ from: listAccounts.CEO });
      await truffleAssertions.fails(token.burn(amount, { from: listAccounts.CFO }), 'Pausable: paused');
    });    

    it('should emit event Burn when burn', async () => {
      const transaction = await token.burn(amount, { from: listAccounts.CFO });
      await truffleAssertions.eventEmitted(transaction, 'Burn',      
        event => event.from === listAccounts.CFO && Number(event.value) === amount);
    });

  });


});
