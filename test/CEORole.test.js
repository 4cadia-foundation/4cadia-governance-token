const helpers = require('./helpers');
const FGToken = artifacts.require('FGToken');
const truffleAssertions = require('truffle-assertions');

contract('CEORole', accounts => {

  let listAccounts;
  let contract;

  beforeEach(async () => {
    listAccounts = helpers.parseAccounts(accounts);
    contract = await FGToken.new('FGToken', 'FGT', 8, 1000, { from: listAccounts.OWNER });
  });

  it('should add a new ceo', async () => {
    await truffleAssertions.passes(contract.addCEO(listAccounts.CEO, { from: listAccounts.OWNER }));
  });

  it('should add a new ceo', async () => {
    await contract.addCEO(listAccounts.ALPHA, { from: listAccounts.OWNER });
    await contract.addCFO(listAccounts.CFO, { from: listAccounts.ALPHA });
    await await truffleAssertions.fails(contract.addCEO(listAccounts.CFO, { from: listAccounts.OWNER }), 'CFO cant be CEO');
  });
  
  it('should return fail for add a new ceo, address not owner', async () => {
    await truffleAssertions.fails(contract.addCEO(listAccounts.CEO, { from: listAccounts.ALPHA }), 'CEORole: caller does not have the CEO role');
  });  

  it('should renounce ceo', async () => {
    await contract.addCEO(listAccounts.CEO, { from: listAccounts.OWNER });
    await truffleAssertions.passes(contract.renounceCEO({ from: listAccounts.CEO }));
  });

  it('should renounce ceo', async () => {
    await contract.addCEO(listAccounts.CEO, { from: listAccounts.OWNER });
    await contract.renounceCEO({ from: listAccounts.OWNER });
    await truffleAssertions.fails(contract.renounceCEO({ from: listAccounts.CEO }), 'there must be a CEO');
  });
  
  it('should renounce ceo', async () => {
    await contract.addCEO(listAccounts.CEO, { from: listAccounts.OWNER });
    await truffleAssertions.passes(contract.renounceCEO({ from: listAccounts.CEO }));
  });

  it('should emit event CfoAdded when add new cfo', async () => {
    const transactionAddCfo = await contract.addCEO(listAccounts.ALPHA, { from: listAccounts.OWNER });
    await truffleAssertions.eventEmitted(transactionAddCfo, 'CEOAdded', ev => ev.account === listAccounts.ALPHA);
  });
  
  it('should emit event CfoRemoved when cfo renounce', async () => {
    await contract.addCEO(listAccounts.CEO, { from: listAccounts.OWNER });
    const transactionRenounce = await contract.renounceCEO({ from: listAccounts.CEO });
    await truffleAssertions.eventEmitted(transactionRenounce, 'CEORemoved', ev => ev.account === listAccounts.CEO);
  });
});
