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
  });

  describe('mint', () => {

    it('mint itself success', async () => {
      await truffleAssertions.passes(token.mint(listAccounts.CFO, amount, { from: listAccounts.CFO }));
    });

    it('mint to OtherAddress success', async () => {
      await truffleAssertions.passes(token.mint(listAccounts.OtherAddress, amount, { from: listAccounts.CFO }));
    });

    it('should fail if account not isCFORole', async () => {
      await truffleAssertions.fails(token.mint(listAccounts.OtherAddress, amount, { from: listAccounts.OtherAddress }), 'CFORole: onlyCFO');
    });    
    
    it('check totalSupply after mint', async () => {
      var totalSupplyBefore = await token.totalSupply();
      await token.mint(listAccounts.CFO, amount, { from: listAccounts.CFO });
      var totalSupplyAfter = await token.totalSupply();      
      assert.equal(Number(totalSupplyBefore + amount), Number(totalSupplyAfter));
    });

    it('check balance after mint', async () => {
      var balanceOfBefore = await token.balanceOf(listAccounts.CFO);
      await token.mint(listAccounts.CFO, amount, { from: listAccounts.CFO });
      var balanceOfAfter = await token.balanceOf(listAccounts.CFO);      
      assert.equal(Number(balanceOfBefore + amount), Number(balanceOfAfter));
    });

    it('check forecast after mint', async () => {
      var forecastBefore = await token.forecast();
      await token.mint(listAccounts.CFO, amount, { from: listAccounts.CFO });
      var forecastAfter = await token.forecast();
      assert.equal(Number(forecastBefore), Number(forecastAfter) + amount);
    });

    it('check maxCap after mint', async () => {
      var maxCapBefore = await token.maxCap();
      await token.mint(listAccounts.CFO, amount, { from: listAccounts.CFO });
      var maxCapAfter = await token.maxCap();      
      assert.equal(Number(maxCapBefore), Number(maxCapAfter));
    });

    it('mint failed if value is greater than forecast', async () => {
      var forecast = await token.forecast();
      var value = forecast + 1;
      await truffleAssertions.fails(token.mint(listAccounts.CFO, value, { from: listAccounts.CFO }), 'amount must be less than forecast value');
    });

    it('mint should fails when token is paused', async () => {
      await token.pause({ from: listAccounts.CEO });
      await truffleAssertions.fails(token.mint(listAccounts.CFO, amount, { from: listAccounts.CFO }), 'Pausable: paused');
    });    

    it('should emit event Mint when mint', async () => {
      const transaction = await token.mint(listAccounts.CFO, amount, { from: listAccounts.CFO });
      await truffleAssertions.eventEmitted(transaction, 'Mint',      
        event => event.to === listAccounts.CFO && Number(event.value) === amount);
    });

  });


});
