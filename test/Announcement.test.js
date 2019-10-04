const FGToken = artifacts.require('FGToken');
const truffleAssertions = require('truffle-assertions');

contract('FGToken', accounts => {

  beforeEach(async () => {
    this.token = await FGToken.new('FGToken', 'FGT', 8, 1000);
  });

  describe('increaseForecast', () => {
    it('should increase forecast', async () => {
      await truffleAssertions.passes(this.token.increaseForecast(100));
    });

    it('should fails increase forecast', async () => {
      await truffleAssertions.fails(this.token.increaseForecast(0), 'value cannot be zero');
    });

    it('should fails for increase forecast, account not is CFORole', async () => {
      await truffleAssertions.fails(this.token.increaseForecast(0, { from: accounts[1] }), 'CFORole: caller does not have the CFO role');
    });

    it('should update forecast balance after call increase forecast method', async () => {
      assert.equal(Number(await this.token.forecast()), 0);
      await truffleAssertions.passes(this.token.increaseForecast(100));
      assert.equal(Number(await this.token.forecast()), 100);
    });

    it('should emit event when increase forecast', async () => {
      const transactionForecast = await this.token.increaseForecast(100);
      await truffleAssertions.eventEmitted(transactionForecast, 'ForecastChange', event => Number(event.oldValue) === 0 && Number(event.newValue) === 100);
    });

    it('method increaseForecast should fails when token is pausable', async () => {
      await this.token.pause();
      await truffleAssertions.fails(this.token.increaseForecast(100), 'Pausable: paused');
    });
  });

  describe('decreaseForecast', () => {
    it('should decrease forecast', async () => {
      await this.token.increaseForecast(100);
      await truffleAssertions.passes(this.token.decreaseForecast(50));
    });

    it('should emit event when decrease forecast', async () => {
      await this.token.increaseForecast(100);
      const decreaseForecast = await this.token.decreaseForecast(50);
      await truffleAssertions.eventEmitted(decreaseForecast, 'ForecastChange', ev => Number(ev.oldValue) === 100 && Number(ev.newValue) === 50);
    });

    it('should fails decrease forecast', async () => {
      await truffleAssertions.fails(this.token.decreaseForecast(0), 'value cannot be zero');
    });

    it('should fails decrase forecast method, forecast has no balance for decrement', async () => {
      await truffleAssertions.fails(this.token.decreaseForecast(100), 'forecast has no balance to decrement');
    });
    it('method decreaseForecast should fails when token is pausable', async () => {
      await this.token.increaseForecast(100);
      await this.token.pause();
      await truffleAssertions.fails(this.token.decreaseForecast(50), 'Pausable: paused');
    });
  });
});
