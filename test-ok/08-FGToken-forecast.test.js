const helpers = require('./helpers');
const FGToken = artifacts.require('FGToken');
const truffleAssertions = require('truffle-assertions');

const {
  name, symbol, decimals, maxCap
} = require('./dataTest');  

const amount = 100 * 10 ** decimals;

contract('FGToken', accounts => {

  let token;
  let listAccounts = helpers.parseAccounts(accounts);

  beforeEach('test', async () => {
    token = await FGToken.new(name, symbol, decimals, maxCap, { from: listAccounts.CEO });
    await token.addCFO(listAccounts.CFO, { from: listAccounts.CEO });
  });

  describe('increaseForecast', () => {

    it('increase forecast', async () => {
      await truffleAssertions.passes(token.increaseForecast(amount, { from: listAccounts.CFO }));
    });

    it('check forecast value after increaseForecast', async () => {
      var forecastBefore = await token.forecast();
      await token.increaseForecast(amount, { from: listAccounts.CFO });
      var forecastAfter = await token.forecast();      
      assert.equal(Number(forecastBefore + amount), Number(forecastAfter));
    });

    it('increaseForecast failed from account not in CFORole', async () => {
      await truffleAssertions.fails(token.increaseForecast(amount, { from: listAccounts.OtherAddress }), 'CFORole: onlyCFO');
    });

    it('increaseForecast failed if value is greater than maxcap', async () => {
      var maxcapToken = await token.maxCap();
      var value = maxcapToken + 1;
      await truffleAssertions.fails(token.increaseForecast(value, { from: listAccounts.CFO }), 'Forecast: greater than maxcap');
    });

    it('increaseForecast failed if value + totalSupply is greater than maxcap', async () => {
      var maxcapToken = await token.maxCap();
      var totalSupply = await token.totalSupply();
      var value = maxcapToken - totalSupply + 1;
      await truffleAssertions.fails(token.increaseForecast(value, { from: listAccounts.CFO }), 'Forecast: greater than maxcap');
    });

    it('increaseForecast should fails when token is paused', async () => {
      await token.pause({ from: listAccounts.CEO });
      await truffleAssertions.fails(token.increaseForecast(amount, { from: listAccounts.CFO }), 'Pausable: paused');
    });    

    it('should emit event ForecastChange when increase forecast', async () => {
      var forecastBefore = await token.forecast();
      const transaction = await token.increaseForecast(amount, { from: listAccounts.CFO });
      var forecastAfter = await token.forecast(); 
      await truffleAssertions.eventEmitted(transaction, 'ForecastChange',
        event => Number(event.oldValue) === Number(forecastBefore) && Number(event.newValue) === Number(forecastAfter));
    });

  });


  describe('decreaseForecast', () => {  

    it('decrease forecast', async () => {
      await token.increaseForecast(amount, { from: listAccounts.CFO });
      await truffleAssertions.passes(token.decreaseForecast(amount, { from: listAccounts.CFO }));
    });

    it('check forecast value after decreaseForecast', async () => {
      await token.increaseForecast(amount, { from: listAccounts.CFO });
      var forecastBefore = await token.forecast();
      await token.decreaseForecast(amount, { from: listAccounts.CFO });
      var forecastAfter = await token.forecast();      
      assert.equal(Number(forecastBefore), Number(forecastAfter + amount));
    });

    it('decreaseForecast failed from account not in CFORole', async () => {
      await token.increaseForecast(amount, { from: listAccounts.CFO });
      await truffleAssertions.fails(token.decreaseForecast(amount, { from: listAccounts.OtherAddress }), 'CFORole: onlyCFO');
    });

    it('decreaseForecast failed if forecast after is less than zero ', async () => {
      //SafeMath: subtraction overflow
      await truffleAssertions.fails(token.decreaseForecast(amount, { from: listAccounts.CFO }));
    });

    it('decreaseForecast should fails when token is paused', async () => {
      await token.increaseForecast(amount, { from: listAccounts.CFO });
      await token.pause({ from: listAccounts.CEO });
      await truffleAssertions.fails(token.decreaseForecast(amount, { from: listAccounts.CFO }), 'Pausable: paused');
    });    

    it('should emit event ForecastChange when decrease forecast', async () => {
      await token.increaseForecast(amount, { from: listAccounts.CFO });
      var forecastBefore = await token.forecast();
      const transaction = await token.decreaseForecast(amount, { from: listAccounts.CFO });
      var forecastAfter = await token.forecast(); 
      await truffleAssertions.eventEmitted(transaction, 'ForecastChange', 
        event => Number(event.oldValue) === Number(forecastBefore) && Number(event.newValue) === Number(forecastAfter));
    });

  });

});
