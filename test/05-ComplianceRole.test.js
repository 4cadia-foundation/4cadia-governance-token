const helpers = require('./helpers');
const FGToken = artifacts.require('FGToken');
const truffleAssertions = require('truffle-assertions');

const {
  name, symbol, decimals, maxCap
} = require('./helpers'); 


contract('ComplianceRole', accounts => {

  let contract;
  let listAccounts = helpers.parseAccounts(accounts);

  beforeEach(async () => {
    contract = await FGToken.new(name, symbol, decimals, maxCap, { from: listAccounts.Creator });
    await contract.addCEO(listAccounts.CEO, { from: listAccounts.Creator });
  });

  describe('ComplianceRole', () => {

    it('should add new compliance', async () => {
      await truffleAssertions.passes(contract.addCompliance(listAccounts.Compliance, { from: listAccounts.CEO }));
    });

    it('should return isCompliance', async () => {
      await contract.addCompliance(listAccounts.Compliance, { from: listAccounts.CEO });
      const response = await contract.isCompliance(listAccounts.Compliance);
      assert.equal(response, true, 'check isCompliance after addCompliance failed');
    });

    it('address not in ComplianceRole should return fail for add a new compliance', async () => {
      await truffleAssertions.fails(contract.addCompliance(listAccounts.Compliance, { from: listAccounts.OtherAddress }), 'CEORole: onlyCEO');
    });

    it('compliance should renounce itself', async () => {
      await contract.addCompliance(listAccounts.Compliance, { from: listAccounts.CEO });
      await contract.addCompliance(listAccounts.OtherAddress, { from: listAccounts.CEO });
      await truffleAssertions.passes(contract.renounceCompliance({ from: listAccounts.Compliance }));
    });

    it('compliance cannot renounce itself if there are only one compliance member', async () => {
      await contract.addCompliance(listAccounts.Compliance, { from: listAccounts.CEO });
      await truffleAssertions.fails(contract.renounceCompliance({ from: listAccounts.Compliance }), 'ComplianceRole: there must have at least one compliance member');
    });

    it('should return total compilance members', async () => {
      await contract.addCompliance(listAccounts.Compliance, { from: listAccounts.CEO });
      const totalComplianceMembers = await contract.totalComplianceMembers();
      assert.equal(totalComplianceMembers, 1, "totalComplianceMembers > 1");
    });

    it('should remove a compliance', async () => {
      await contract.addCompliance(listAccounts.Compliance, { from: listAccounts.CEO });
      await contract.addCompliance(listAccounts.OtherAddress, { from: listAccounts.CEO });
      await truffleAssertions.passes(contract.removeCompliance(listAccounts.Compliance, { from: listAccounts.CEO }));
    });

    it('address not in ComplianceRole should return fail for remove a compliance', async () => {
      await contract.addCompliance(listAccounts.Compliance, { from: listAccounts.CEO });
      await truffleAssertions.fails(contract.removeCompliance(listAccounts.Compliance, { from: listAccounts.OtherAddress }), 'CEORole: onlyCEO');
    });

    it('should emit event ComplianceAdded', async () => {
      const transaction = await contract.addCompliance(listAccounts.Compliance, { from: listAccounts.Creator });
      await truffleAssertions.eventEmitted(transaction, 'ComplianceAdded', ev => ev.account === listAccounts.Compliance);
    });

    it('should emit event ComplianceRemoved when removeCompliance', async () => {
      await contract.addCompliance(listAccounts.Compliance, { from: listAccounts.CEO });
      await contract.addCompliance(listAccounts.OtherAddress, { from: listAccounts.CEO });

      const transaction = await contract.removeCompliance(listAccounts.Compliance, { from: listAccounts.CEO });
      await truffleAssertions.eventEmitted(transaction, 'ComplianceRemoved', ev => ev.account === listAccounts.Compliance);
    });

    it('should emit event ComplianceRemoved when renounceCompliance', async () => {
      await contract.addCompliance(listAccounts.Compliance, { from: listAccounts.CEO });
      await contract.addCompliance(listAccounts.OtherAddress, { from: listAccounts.CEO });
      const transaction = await contract.renounceCompliance({ from: listAccounts.Compliance });
      await truffleAssertions.eventEmitted(transaction, 'ComplianceRemoved', ev => ev.account === listAccounts.Compliance);
    });

  });

});
