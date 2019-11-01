const helpers = require('./helpers');
const truffleAssertions = require('truffle-assertions');

contract('FGToken', accounts => {
 
  let listAccounts;
  let contract;

  beforeEach('beforeEach: transferfrom', async () => {

    listAccounts = helpers.parseAccounts(accounts);
    contract = await helpers.instanceContract(accounts);
    contract.addWhitelistAdmin(listAccounts.ALPHA, { from: listAccounts.OWNER });
  });

  describe('WhitelistedRole', () => {
  
    it('should add account in whitelist', async () => {
      await truffleAssertions.passes(contract.addwhitelist(listAccounts.BETA, { from: listAccounts.ALPHA }));
    });

    it('should return true when an address existing in list', async () => {
      await contract.addwhitelist(listAccounts.BETA, { from: listAccounts.ALPHA });
      const isWhitelisted = await contract.isWhitelisted(listAccounts.BETA);
      assert.equal(isWhitelisted, true);
    });

    it('should return false when an address not existing in list', async () => {
      const isWhitelisted = await contract.isWhitelisted(listAccounts.GAMMA);
      assert.equal(isWhitelisted, false);
    });

    it('should remove account of whitelist', async () => {
      await contract.addwhitelist(listAccounts.BETA, { from: listAccounts.ALPHA });
      await truffleAssertions.passes(contract.removeWhitelist(listAccounts.BETA, { from: listAccounts.ALPHA }));
    });

    it('should renounce whitelist', async () => {
      await contract.addwhitelist(listAccounts.BETA, { from: listAccounts.ALPHA });
      await truffleAssertions.passes(contract.renounceWhitelist({ from: listAccounts.BETA }));
    });
  
    it('should emit event WhitelistedAdded', async () => {
      const transaction =  await contract.addwhitelist(listAccounts.BETA, { from: listAccounts.ALPHA });
      await truffleAssertions.passes(transaction, 'WhitelistedAdded', ev => ev.account === listAccounts.BETA);
    });
  
    it('should emit event WhitelistedRemoved when use the method renounceWhitelist', async () => {
      await contract.addwhitelist(listAccounts.BETA, { from: listAccounts.ALPHA });
      const transaction = await contract.renounceWhitelist({ from: listAccounts.BETA });
      await truffleAssertions.passes(transaction, 'WhitelistedRemoved', ev => ev.account === listAccounts.BETA);
    });
  
    it('should emit event WhitelistedRemoved when use the method removeWhitelist', async () => {
      await contract.addwhitelist(listAccounts.BETA, { from: listAccounts.ALPHA });
      const transaction = await contract.removeWhitelist(listAccounts.BETA, { from: listAccounts.ALPHA });
      await truffleAssertions.passes(transaction, 'WhitelistedRemoved', ev => ev.account === listAccounts.BETA);
    });
  });
});
