const FGToken = artifacts.require('FGToken');
const truffleAssertions = require('truffle-assertions');

contract('CEORole', accounts => {
  const addressOwner = accounts[0];
  const addressCeo = accounts[2];

  beforeEach(async () => {
    this.contract = await FGToken.new('FGToken', 'FGT', 8, 5000);
  });

  it('should add a new ceo', async () => {
    await truffleAssertions.passes(this.contract.addCEO(addressCeo, { from: addressOwner }));
  });

  it('should return fail for add a new ceo, address not owner', async () => {
    await truffleAssertions.fails(this.contract.addCEO(addressCeo, { from: accounts[3] }), 'CEORole: caller does not have the CEO role');
  });

  it('should renounce ceo', async () => {
    await this.contract.addCEO(addressCeo, { from: addressOwner });
    await truffleAssertions.passes(this.contract.renounceCEO({ from: addressCeo }));
  });

  it('should verify if address is cfo', async () => {
    await this.contract.addCEO(addressCeo, { from: addressOwner });
    const isCeo = await this.contract.isCEO(addressCeo);
    assert.equal(isCeo, true);
  });

  it('should emit event CfoAdded when add new cfo', async () => {
    const transactionAddCfo = await this.contract.addCEO(addressCeo, { from: addressOwner });
    await truffleAssertions.eventEmitted(transactionAddCfo, 'CEOAdded', ev => ev.account === addressCeo);
  });

  it('should emit event CfoRemoved when cfo renounce', async () => {
    await this.contract.addCEO(addressCeo, { from: addressOwner });
    const transactionRenounce = await this.contract.renounceCEO({ from: addressCeo });
    await truffleAssertions.eventEmitted(transactionRenounce, 'CEORemoved', ev => ev.account === addressCeo);
  });
});
