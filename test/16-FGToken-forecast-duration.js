const FGToken = artifacts.require('FGToken');
const truffleAssertions = require('truffle-assertions');

const { name, symbol, decimals, maxCap, forecastAmount, forecastDuration, parseAccounts, time } = require('./helpers');  

contract('FGToken', accounts => {

  let token;
  const listAccounts = parseAccounts(accounts);

  beforeEach('test', async () => {
    token = await FGToken.new(name, symbol, decimals, maxCap, forecastDuration, { from: listAccounts.CEO });
    await token.addCFO(listAccounts.CFO, { from: listAccounts.CEO });
  });

  describe('Time Forecast', () => {

    it('should change forecast wait', async () => {
      const duration = 10;
      await truffleAssertions.passes(token.changeForecastWait(duration, { from: listAccounts.CEO }));
      assert.equal(await token.forecastWait(), (time.day * duration));
    });

    it('should validate rule CEO', async () => {
      const duration = 10;
      await truffleAssertions.fails(token.changeForecastWait(duration, { from: listAccounts.OtherAddress }), 'CEORole: onlyCEO');
    });

    it('should return last forecast date', async () => {
      await truffleAssertions.passes(token.lastForecastDate());
    });

    it('should return forecast wait time', async () => {
      await truffleAssertions.passes(token.forecastWait());
    });

    it('should return fails FGToken: forecast before wait time', async () => {
      await token.increaseForecast(forecastAmount, { from: listAccounts.CFO });
      await truffleAssertions.fails(token.increaseForecast(forecastAmount, { from: listAccounts.CFO }), 'FGToken: forecast before wait time');
    });
  });

});
