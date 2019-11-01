const helpers = require('./helpers');
const FGToken = artifacts.require('FGToken');
const truffleAssertions = require('truffle-assertions');

const {
  name, symbol, decimals, maxCap
} = require('./dataTest'); 


contract('WhitelistedRole', accounts => {

  let contract;
  let listAccounts = helpers.parseAccounts(accounts);

  beforeEach(async () => {
    contract = await FGToken.new(name, symbol, decimals, maxCap, { from: listAccounts.Creator });
  });

  describe('WhitelistedRole', () => {

    it('should add new whitelist member', async () => {
      await truffleAssertions.passes(contract.addWhitelist(listAccounts.Whitelisted, { from: listAccounts.Creator }));
    });    

    it('should return isWhitelisted', async () => {
      await contract.addWhitelist(listAccounts.Whitelisted, { from: listAccounts.Creator });
      const response = await contract.isWhitelisted(listAccounts.Whitelisted);
      var expected = true;
      assert.equal(response, expected, "check isWhitelisted after addWhitelist failed");
    });

    it('address not in ComplianceRole should return fail for add a new whitelist member', async () => {
      await truffleAssertions.fails(contract.addWhitelist(listAccounts.Whitelisted, { from: listAccounts.OtherAddress }), 'ComplianceRole: onlyCompliance');
    });

    it('whitelist member should renounce itself', async () => {
      await contract.addWhitelist(listAccounts.Whitelisted, { from: listAccounts.Creator });
      await truffleAssertions.passes(contract.renounceWhitelist({ from: listAccounts.Whitelisted }));
    });

    it('should remove a whitelist member', async () => {
      await contract.addWhitelist(listAccounts.Whitelisted, { from: listAccounts.Creator });
      await truffleAssertions.passes(contract.removeWhitelist(listAccounts.Whitelisted, { from: listAccounts.Creator }));
    });

    it('address not in ComplianceRole should return fail for remove a whitelist member', async () => {
      await contract.addWhitelist(listAccounts.Whitelisted, { from: listAccounts.Creator });
      await truffleAssertions.fails(contract.removeWhitelist(listAccounts.Whitelisted, { from: listAccounts.OtherAddress }), 'ComplianceRole: onlyCompliance');
    })

    it('should emit event WhitelistedAdded', async () => {
      const transaction = await contract.addWhitelist(listAccounts.Whitelisted, { from: listAccounts.Creator });
      await truffleAssertions.eventEmitted(transaction, 'WhitelistedAdded', ev => ev.account === listAccounts.Whitelisted);
    });

    it('should emit event WhitelistedRemoved when removeWhitelist', async () => {
      await contract.addWhitelist(listAccounts.Whitelisted, { from: listAccounts.Creator });
      const transaction = await contract.removeWhitelist(listAccounts.Whitelisted, { from: listAccounts.Creator });
      await truffleAssertions.eventEmitted(transaction, 'WhitelistedRemoved', ev => ev.account === listAccounts.Whitelisted);
    });

    it('should emit event WhitelistedRemoved when renounceWhitelist', async () => {
      await contract.addWhitelist(listAccounts.Whitelisted, { from: listAccounts.Creator });
      const transaction = await contract.renounceWhitelist({ from: listAccounts.Whitelisted });
      await truffleAssertions.eventEmitted(transaction, 'WhitelistedRemoved', ev => ev.account === listAccounts.Whitelisted);
    });

  });

});
