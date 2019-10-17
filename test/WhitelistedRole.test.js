const FGToken = artifacts.require('FGToken');
const truffleAssertions = require('truffle-assertions');

contract('FGToken', accounts => {
  beforeEach(async () => {
    this.token = await FGToken.new('FGToken', 'FGT', 8, 1000);
    await this.token.increaseForecast(1000);
    await this.token.mint(1000);
  });

  describe('WhitelistedRole', () => {
   
    it('should add account in whitelist', async () => {
      await truffleAssertions.passes(this.token.addwhitelist(accounts[1]));
    });

    it('should return true when an address existing in list', async () => {
      await this.token.addwhitelist(accounts[1]);
      const isWhitelisted = await this.token.isWhitelisted(accounts[1]);
      assert.equal(isWhitelisted, true);
    });

    it('should return false when an address not existing in list', async () => {
      const isWhitelisted = await this.token.isWhitelisted(accounts[1]);
      assert.equal(isWhitelisted, false);
    });

    it('should remove account of whitelist', async () => {
      await this.token.addwhitelist(accounts[1]);
      await truffleAssertions.passes(this.token.removeWhitelist(accounts[1]));
    });

    it('should renounce whitelist', async () => {
      await this.token.addwhitelist(accounts[1]);
      await truffleAssertions.passes(this.token.renounceWhitelist({ from: accounts[1] }));
    });

    it('should emit event WhitelistedAdded', async () => {
      const transaction = await this.token.addwhitelist(accounts[1]);
      await truffleAssertions.passes(transaction, 'WhitelistedAdded', ev => ev.account === accounts[1]);
    });

    it('should emit event WhitelistedRemoved when use the method renounceWhitelist', async () => {
      await this.token.addwhitelist(accounts[1]);
      const transaction = await this.token.renounceWhitelist({ from: accounts[1] });
      await truffleAssertions.passes(transaction, 'WhitelistedRemoved', ev => ev.account === accounts[1]);
    });

    it('should emit event WhitelistedRemoved when use the method removeWhitelist', async () => {
      await this.token.addwhitelist(accounts[1]);
      const transaction = await this.token.removeWhitelist(accounts[1]);
      await truffleAssertions.passes(transaction, 'WhitelistedRemoved', ev => ev.account === accounts[1]);
    });

  });
});
