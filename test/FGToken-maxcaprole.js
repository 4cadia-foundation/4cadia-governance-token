const FGToken = artifacts.require('FGToken');
const truffleAssertions = require('truffle-assertions');

contract('FGToken', accounts => {
  beforeEach(async () => {
    this.token = await FGToken.new('FGToken', 'FGT', 8, 1000);
    await this.token.increaseForecast(1000);
    await this.token.mint(accounts[0], 1000);
  });

  describe('MaxCapRole', () => {
    it('should return maxcap manager', async () => {
      await truffleAssertions.passes(this.token.isMaxCapManager(accounts[0]));
    });

    it('should fails account not CEO role', async () => {
      await truffleAssertions.fails(this.token.addMaxCapManager(accounts[2], { from: accounts[1] }), 'CEORole: caller does not have the CEO role');
    });

    it('should add new maxcap manager', async () => {
      await truffleAssertions.passes(this.token.addMaxCapManager(accounts[1], { from: accounts[0] }));
    });

    it('should renounce maxcap manager', async () => {
      await this.token.addMaxCapManager(accounts[1], { from: accounts[0] });
      await truffleAssertions.passes(this.token.renounceMaxCapManager());
    });

    it('should emit event MaxCapManagerAdded', async () => {
      const transaction = await this.token.addMaxCapManager(accounts[1]);
      await truffleAssertions.eventEmitted(transaction, 'MaxCapManagerAdded', ev => ev.account === accounts[1]);
    });

    it('should emit event MaxCapManagerRemoved', async () => {
      await this.token.addMaxCapManager(accounts[1], { from: accounts[0] });
      const transaction = await this.token.renounceMaxCapManager({ from: accounts[1] });
      await truffleAssertions.eventEmitted(transaction, 'MaxCapManagerRemoved', ev => ev.account === accounts[1]);
    });
  });
});
