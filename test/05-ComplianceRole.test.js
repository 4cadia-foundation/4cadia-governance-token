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
  });

  describe('ComplianceRole', () => {

    it('should add new compliance', async () => {
      await truffleAssertions.passes(contract.addCompliance(listAccounts.Compliance, { from: listAccounts.Creator }));
    });    

    it('should return isCompliance', async () => {
      await contract.addCompliance(listAccounts.Compliance, { from: listAccounts.Creator });
      const response = await contract.isCompliance(listAccounts.Compliance);
      var expected = true;
      assert.equal(response, expected, "check isCompliance after addCompliance failed");
    });

    it('address not in ComplianceRole should return fail for add a new compliance', async () => {
      await truffleAssertions.fails(contract.addCompliance(listAccounts.Compliance, { from: listAccounts.OtherAddress }), 'ComplianceRole: onlyCompliance');
    });

    it('compliance should renounce itself', async () => {
      await contract.addCompliance(listAccounts.Compliance, { from: listAccounts.Creator });
      await truffleAssertions.passes(contract.renounceCompliance({ from: listAccounts.Compliance }));
    });

    it('compliance cannot renounce itself if there are only one compliance member', async () => {
      const totalComplianceMembers = await contract.totalComplianceMembers();
      var expected = 1;
      if (totalComplianceMembers == expected){
        await truffleAssertions.fails(contract.renounceCompliance({ from: listAccounts.Creator }), 'ComplianceRole: there must have at least one compliance member');
      }
      else {
        assert.equal(totalComplianceMembers, expected, "totalComplianceMembers > 1");
      }
    });

    it('should remove a compliance', async () => {
      await contract.addCompliance(listAccounts.Compliance, { from: listAccounts.Creator });
      await truffleAssertions.passes(contract.removeCompliance(listAccounts.Compliance, { from: listAccounts.Creator }));
    });

    it('address not in ComplianceRole should return fail for remove a compliance', async () => {
      await contract.addCompliance(listAccounts.Compliance, { from: listAccounts.Creator });
      await truffleAssertions.fails(contract.removeCompliance(listAccounts.Compliance, { from: listAccounts.OtherAddress }), 'ComplianceRole: onlyCompliance');
    })

    it('should emit event ComplianceAdded', async () => {
      const transaction = await contract.addCompliance(listAccounts.Compliance, { from: listAccounts.Creator });
      await truffleAssertions.eventEmitted(transaction, 'ComplianceAdded', ev => ev.account === listAccounts.Compliance);
    });

    it('should emit event ComplianceRemoved when removeCompliance', async () => {
      await contract.addCompliance(listAccounts.Compliance, { from: listAccounts.Creator });
      const transaction = await contract.removeCompliance(listAccounts.Compliance, { from: listAccounts.Creator });
      await truffleAssertions.eventEmitted(transaction, 'ComplianceRemoved', ev => ev.account === listAccounts.Compliance);
    });

    it('should emit event ComplianceRemoved when renounceCompliance', async () => {
      await contract.addCompliance(listAccounts.Compliance, { from: listAccounts.Creator });
      const transaction = await contract.renounceCompliance({ from: listAccounts.Compliance });
      await truffleAssertions.eventEmitted(transaction, 'ComplianceRemoved', ev => ev.account === listAccounts.Compliance);
    });

  });

});
