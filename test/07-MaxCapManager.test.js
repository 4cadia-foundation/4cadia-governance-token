const helpers = require('./helpers');
const FGToken = artifacts.require('FGToken');
const truffleAssertions = require('truffle-assertions');

const {
  name, symbol, decimals, maxCap
} = require('./helpers'); 


contract('MaxCapRole', accounts => {

  let contract;
  let listAccounts = helpers.parseAccounts(accounts);

  beforeEach(async () => {
    contract = await FGToken.new(name, symbol, decimals, maxCap, { from: listAccounts.Creator });
  });

  describe('MaxCapRole', () => {

    it('should add new maxcap manager', async () => {
      await truffleAssertions.passes(contract.addMaxCapManager(listAccounts.MaxCapManager, { from: listAccounts.Creator }));
    });    

    it('should return maxcap manager', async () => {
      await contract.addMaxCapManager(listAccounts.MaxCapManager, { from: listAccounts.Creator });
      const response = await contract.isMaxCapManager(listAccounts.MaxCapManager);
      var expected = true;
      assert.equal(response, expected, "check isMaxCapManager after addMaxCapManager failed");
    });

    it('address not in CEOrole should return fail for add a new maxcap manager', async () => {
      await truffleAssertions.fails(contract.addMaxCapManager(listAccounts.MaxCapManager, { from: listAccounts.OtherAddress }), 'CEORole: onlyCEO');
    });

    it('maxcap manager should renounce itself', async () => {
      await contract.addMaxCapManager(listAccounts.MaxCapManager, { from: listAccounts.Creator });
      await truffleAssertions.passes(contract.renounceMaxCapManager({ from: listAccounts.MaxCapManager }));
    });

    it('should remove a maxcap manager', async () => {
      await contract.addMaxCapManager(listAccounts.MaxCapManager, { from: listAccounts.Creator });
      await truffleAssertions.passes(contract.removeMaxCapManager(listAccounts.MaxCapManager, { from: listAccounts.Creator }));
    });

    it('address not in CEOrole should return fail for remove a maxcap manager', async () => {
      await contract.addMaxCapManager(listAccounts.MaxCapManager, { from: listAccounts.Creator });
      await truffleAssertions.fails(contract.removeMaxCapManager(listAccounts.MaxCapManager, { from: listAccounts.OtherAddress }), 'CEORole: onlyCEO');
    })

    it('should emit event MaxCapManagerAdded', async () => {
      const transaction = await contract.addMaxCapManager(listAccounts.MaxCapManager, { from: listAccounts.Creator });
      await truffleAssertions.eventEmitted(transaction, 'MaxCapManagerAdded', ev => ev.account === listAccounts.MaxCapManager);
    });

    it('should emit event MaxCapManagerRemoved when removeMaxCapManager', async () => {
      await contract.addMaxCapManager(listAccounts.MaxCapManager, { from: listAccounts.Creator });
      const transaction = await contract.removeMaxCapManager(listAccounts.MaxCapManager, { from: listAccounts.Creator });
      await truffleAssertions.eventEmitted(transaction, 'MaxCapManagerRemoved', ev => ev.account === listAccounts.MaxCapManager);
    });

    it('should emit event MaxCapManagerRemoved when renounceMaxCapManager', async () => {
      await contract.addMaxCapManager(listAccounts.MaxCapManager, { from: listAccounts.Creator });
      const transaction = await contract.renounceMaxCapManager({ from: listAccounts.MaxCapManager });
      await truffleAssertions.eventEmitted(transaction, 'MaxCapManagerRemoved', ev => ev.account === listAccounts.MaxCapManager);
    });

  });

});
