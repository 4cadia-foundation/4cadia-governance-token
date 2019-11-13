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

  describe('CeoRole', () => {  

    it('should add a new ceo', async () => {
      await truffleAssertions.passes(contract.addCEO(listAccounts.CEO, { from: listAccounts.Creator }));
    });

    it('isCEO', async () => {
      await contract.addCEO(listAccounts.CEO, { from: listAccounts.Creator })
      const response = await contract.isCEO(listAccounts.CEO);
      var expected = true;
      assert.equal(response, expected, "check isCEO after addCEO failed");
    });

    it('CEO cannot be CFO', async () => {
      await contract.addCEO(listAccounts.CEO, { from: listAccounts.Creator });
      await truffleAssertions.fails(contract.addCFO(listAccounts.CEO, { from: listAccounts.Creator }), 'CEO cannot be CFO');
    });

    it('address not in CEOrole should return fail for add a new ceo', async () => {
      await truffleAssertions.fails(contract.addCEO(listAccounts.CEO, { from: listAccounts.OtherAddress }), 'CEORole: onlyCEO');
    });  

    it('ceo should renounce itself', async () => {
      await contract.addCEO(listAccounts.CEO, { from: listAccounts.Creator });
      await truffleAssertions.passes(contract.renounceCEO({ from: listAccounts.CEO }));
    });

    it('ceo cannot renounce itself if there are only one ceo', async () => {
      const totalCEOMembers = await contract.totalCEOMembers();
      var expected = 1;
      if (totalCEOMembers == expected){
        await truffleAssertions.fails(contract.renounceCEO({ from: listAccounts.Creator }), 'CEORole: there must have at least one CEO');
      }
      else {
        assert.equal(totalCEOMembers, expected, "totalCEOMembers > 1");
      }
    });

    it('should remove a ceo', async () => {
      await contract.addCEO(listAccounts.CEO, { from: listAccounts.Creator });
      await truffleAssertions.passes(contract.removeCEO(listAccounts.CEO, { from: listAccounts.Creator }));
    });

    it('address not in CEOrole should return fail for remove a ceo', async () => {
      await contract.addCEO(listAccounts.CEO, { from: listAccounts.Creator });
      await truffleAssertions.fails(contract.removeCEO(listAccounts.CEO, { from: listAccounts.OtherAddress }), 'CEORole: onlyCEO');
    });

    it('should emit event CeoAdded when add new ceo', async () => {
      const transaction = await contract.addCEO(listAccounts.CEO, { from: listAccounts.Creator });
      await truffleAssertions.eventEmitted(transaction, 'CEOAdded', ev => ev.account === listAccounts.CEO);
    });

    it('should emit event CeoRemoved when remove a ceo', async () => {
      await contract.addCEO(listAccounts.CEO, { from: listAccounts.Creator });
      const transaction = await contract.removeCEO(listAccounts.CEO, { from: listAccounts.Creator });
      await truffleAssertions.eventEmitted(transaction, 'CEORemoved', ev => ev.account === listAccounts.CEO);
    });
    
    it('should emit event CeoRemoved when ceo renounce', async () => {
      await contract.addCEO(listAccounts.CEO, { from: listAccounts.Creator });
      const transaction = await contract.renounceCEO({ from: listAccounts.CEO });
      await truffleAssertions.eventEmitted(transaction, 'CEORemoved', ev => ev.account === listAccounts.CEO);
    });

  });
});
