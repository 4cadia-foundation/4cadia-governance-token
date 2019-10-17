const FGToken = artifacts.require('FGToken');
const truffleAssertions = require('truffle-assertions');

contract('FGToken', accounts => {
  beforeEach(async () => {
    this.token = await FGToken.new('FGToken', 'FGT', 8, 1000);
    await this.token.increaseForecast(1000);
    await this.token.mint(accounts[0], 1000);
  });

  describe('maxCap', () => {
    it('should return balance of max cap', async () => {
      const maxCap = await this.token.maxCap();
      assert.equal(Number(maxCap), 1000);
    });

    it('should increment max cap value', async () => {
      await truffleAssertions.passes(this.token.increaseMaxCap(1000));
    });

    it('should decrement max cap value', async () => {
      await this.token.increaseMaxCap(1000);
      await truffleAssertions.passes(this.token.decreaseMaxCap(200));
    });

    it('should fail decrement max cap value greater than maxcap', async () => {
      await truffleAssertions.fails(this.token.decreaseMaxCap(2000), 'value cannot be greater than maxCap');
    });

    it('increaseMaxCap should fail with caller does not have the MaxCap role', async () => {
      await truffleAssertions.fails(this.token.increaseMaxCap(1000, { from: accounts[1] }), 'MaxCapManager: caller does not have the MaxCap role');
    });

    it('decreaseMaxCap should fail with caller does not have the MaxCap role', async () => {
      await truffleAssertions.fails(this.token.decreaseMaxCap(1000, { from: accounts[1] }), 'MaxCapManager: caller does not have the MaxCap role');
    });

    it('should emit event MaxCapChange when increment', async () => {
      const transaction = await this.token.increaseMaxCap(1000);
      await truffleAssertions.eventEmitted(transaction, 'MaxCapChange', ev => Number(ev.oldValue) === 1000 && Number(ev.newValue) === 2000);
    });

    it('should emit event MaxCapChange when decrease', async () => {
      const transaction = await this.token.decreaseMaxCap(500);
      await truffleAssertions.eventEmitted(transaction, 'MaxCapChange', ev => Number(ev.oldValue) === 1000 && Number(ev.newValue) === 500);
    });
  });
});
