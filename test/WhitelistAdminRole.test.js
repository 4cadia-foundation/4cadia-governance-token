const FGToken = artifacts.require('FGToken');
const truffleAssertions = require('truffle-assertions');

contract('FGToken', accounts => {

  beforeEach(async () => {
    this.token = await FGToken.new('FGToken', 'FGT', 8, 1000);
    await this.token.increaseForecast(1000);
    await this.token.mint(1000);
  });

  describe('WhitelistAdminRole', () => {
    it('should add new whitelistadmin', async () => {
      await truffleAssertions.passes(this.token.addWhitelistAdmin(accounts[1]));
    });

    it('should fail account not whitelistadmin ', async () => {
      await truffleAssertions.fails(this.token.addWhitelistAdmin(accounts[1], { from: accounts[2] }), 'WhitelistAdminRole: caller does not have the WhitelistAdmin role');
    });

    it('should add new renounceWhitelistAdmin', async () => {
      await truffleAssertions.passes(this.token.renounceWhitelistAdmin());
    });

    it('should validate if address is admin of whitelist', async () => {
      const isWhitelistAdmin = await this.token.isWhitelistAdmin(accounts[0]);
      assert.equal(isWhitelistAdmin, true);
    });

    it('should emit event WhitelistAdminAdded', async () => {
      const transaction = await this.token.addWhitelistAdmin(accounts[1]);
      await truffleAssertions.eventEmitted(transaction, 'WhitelistAdminAdded', ev => ev.account === accounts[1]);
    });

    it('should emit event WhitelistAdminRemoved', async () => {
      const transaction = await this.token.renounceWhitelistAdmin();
      await truffleAssertions.eventEmitted(transaction, 'WhitelistAdminRemoved', ev => ev.account === accounts[0]);
    });

  });
});
