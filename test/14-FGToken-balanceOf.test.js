const helpers = require('./helpers');
const FGToken = artifacts.require('FGToken');
const BalanceContract = artifacts.require('BalanceContract');
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
    await token.mint(listAccounts.User, amount, { from: listAccounts.CFO });
  });

  describe('balanceOf', () => {
    it('should call balanceOf method successfully', async () => {
      await truffleAssertions.passes(token.balanceOf(listAccounts.User));
    });

    it('should return account balance amount', async () => {
      const balance = await token.balanceOf(listAccounts.User);
      assert.equal(balance.toNumber(), amount);
    });

    it('should return the balance zero for account withount funds', async () => {
      const balance = await token.balanceOf(listAccounts.User2);
      assert.equal(balance.toNumber(), 0);
    });

    it('should fail when account not is a address', async () => {
      await truffleAssertions.fails(token.balanceOf(1), 'invalid address');
    });
  });

});
