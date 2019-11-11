const helpers = require('./helpers');
const FGToken = artifacts.require('FGToken');
const truffleAssertions = require('truffle-assertions');

const { name, symbol, decimals, maxCap, forecastDuration } = require('./helpers'); 


contract('CeoCfoRole', accounts => {

  let contract;
  let listAccounts = helpers.parseAccounts(accounts);

  beforeEach(async () => {
    contract = await FGToken.new(name, symbol, decimals, maxCap, forecastDuration, { from: listAccounts.Creator });
  });

  describe('CfoRole', () => {  

    it('should add a new cfo', async () => {
      await truffleAssertions.passes(contract.addCFO(listAccounts.CFO, { from: listAccounts.Creator }));
    });

    it('isCFO', async () => {
      await contract.addCFO(listAccounts.CFO, { from: listAccounts.Creator })
      const response = await contract.isCFO(listAccounts.CFO);
      var expected = true;
      assert.equal(response, expected, "check isCFO after addCFO failed");
    });

    it('CFO cannot be CEO', async () => {
      await contract.addCFO(listAccounts.CFO, { from: listAccounts.Creator });
      await truffleAssertions.fails(contract.addCEO(listAccounts.CFO, { from: listAccounts.Creator }), 'CFO cannot be CEO');
    });

    it('address not in CEOrole should return fail for add a new cfo', async () => {
      await truffleAssertions.fails(contract.addCFO(listAccounts.CFO, { from: listAccounts.OtherAddress }), 'CEORole: onlyCEO');
    });  

    it('cfo should renounce itself', async () => {
      await contract.addCFO(listAccounts.CFO, { from: listAccounts.Creator });
      await truffleAssertions.passes(contract.renounceCFO({ from: listAccounts.CFO }));
    });

    it('should remove a cfo', async () => {
      await contract.addCFO(listAccounts.CFO, { from: listAccounts.Creator });
      await truffleAssertions.passes(contract.removeCFO(listAccounts.CFO, { from: listAccounts.Creator }));
    });

    it('address not in CEOrole should return fail for remove a cfo', async () => {
      await contract.addCFO(listAccounts.CFO, { from: listAccounts.Creator });
      await truffleAssertions.fails(contract.removeCFO(listAccounts.CFO, { from: listAccounts.OtherAddress }), 'CEORole: onlyCEO');
    });

    it('should emit event CfoAdded when add new cfo', async () => {
      const transaction = await contract.addCFO(listAccounts.CFO, { from: listAccounts.Creator });
      await truffleAssertions.eventEmitted(transaction, 'CFOAdded', ev => ev.account === listAccounts.CFO);
    });

    it('should emit event CfoRemoved when remove a cfo', async () => {
      await contract.addCFO(listAccounts.CFO, { from: listAccounts.Creator });
      const transaction = await contract.removeCFO(listAccounts.CFO, { from: listAccounts.Creator });
      await truffleAssertions.eventEmitted(transaction, 'CFORemoved', ev => ev.account === listAccounts.CFO);
    });
    
    it('should emit event CfoRemoved when cfo renounce', async () => {
      await contract.addCFO(listAccounts.CFO, { from: listAccounts.Creator });
      const transaction = await contract.renounceCFO({ from: listAccounts.CFO });
      await truffleAssertions.eventEmitted(transaction, 'CFORemoved', ev => ev.account === listAccounts.CFO);
    });

  });
});
