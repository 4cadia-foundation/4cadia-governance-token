const helpers = require('./helpers');
const truffleAssertions = require('truffle-assertions');

contract('FGToken', accounts => {

  let listAccounts;
  let contract;

  beforeEach('beforeEach: transferfrom', async () => {

    listAccounts = helpers.parseAccounts(accounts);
    contract = await helpers.instanceContract(accounts);
  });

  describe('WhitelistAdminRole', () => {
    
    it('should add new whitelistadmin', async () => {
      await truffleAssertions.passes(contract.addWhitelistAdmin(listAccounts.ALPHA, { from: listAccounts.OWNER }));
    });

    it('should fail account not whitelistadmin ', async () => {
      await truffleAssertions.fails(contract.addWhitelistAdmin(listAccounts.ALPHA, { from: listAccounts.NOTOWNER }), 'WhitelistAdminRole: caller does not have the WhitelistAdmin role');
    });

    it('should add new renounceWhitelistAdmin', async () => {
      await contract.addWhitelistAdmin(listAccounts.ALPHA, { from: listAccounts.OWNER });
      await truffleAssertions.passes(contract.renounceWhitelistAdmin({ from: listAccounts.ALPHA }));
    });

    it('should validate if address is admin of whitelist', async () => {
      await contract.addWhitelistAdmin(listAccounts.ALPHA, { from: listAccounts.OWNER });
      const isWhitelistAdmin = await contract.isWhitelistAdmin(listAccounts.ALPHA);
      assert.equal(isWhitelistAdmin, true);
    });

    it('should emit event WhitelistAdminAdded', async () => {
      const transaction = await contract.addWhitelistAdmin(listAccounts.ALPHA, { from: listAccounts.OWNER });
      await truffleAssertions.eventEmitted(transaction, 'WhitelistAdminAdded', ev => ev.account === listAccounts.ALPHA);
    });

    it('should emit event WhitelistAdminRemoved', async () => {
      await contract.addWhitelistAdmin(listAccounts.ALPHA, { from: listAccounts.OWNER });
      const transaction = await contract.renounceWhitelistAdmin({ from: listAccounts.ALPHA });
      await truffleAssertions.eventEmitted(transaction, 'WhitelistAdminRemoved', ev => ev.account === listAccounts.ALPHA);
    });
  });
});
