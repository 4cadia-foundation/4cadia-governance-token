const FGToken = artifacts.require('FGToken');
const truffleAssertions = require('truffle-assertions');

contract('CFORole', accounts => {
  const addressCto = accounts[0];
  const addressCfo = accounts[2];

  beforeEach(async () => {
    this.contract = await FGToken.new('FGToken', 'FGT', 8, 1000);
    await this.contract.increaseForecast(1000);
    await this.contract.mint(accounts[0], 1000);
  });

  it('should add a new cfo', async () => {
    await truffleAssertions.passes(this.contract.addCFO(addressCfo, { from: addressCto }));
  });

  it('should return fail for add a new cfo, address not owner', async () => {
    await truffleAssertions.fails(this.contract.addCFO(addressCfo, { from: accounts[3] }), 'CEORole: caller does not have the CEO role');
  });

  it('should renounce cfo', async () => {
    await this.contract.addCFO(addressCfo, { from: addressCto });
    await truffleAssertions.passes(this.contract.renounceCFO({ from: addressCfo }));
  });

  it('should verify if address is cfo', async () => {
    await this.contract.addCFO(addressCfo, { from: addressCto });
    const isCfo = await this.contract.isCFO(addressCfo);
    assert.equal(isCfo, true);
  });

  it('should emit event CfoAdded when add new cfo', async () => {
    const transactionAddCfo = await this.contract.addCFO(addressCfo, { from: addressCto });
    await truffleAssertions.eventEmitted(transactionAddCfo, 'CFOAdded', ev => ev.account === addressCfo);
  });

  it('should emit event CfoRemoved when cfo renounce', async () => {
    await this.contract.addCFO(addressCfo, { from: addressCto });
    const transactionRenounce = await this.contract.renounceCFO({ from: addressCfo });
    await truffleAssertions.eventEmitted(transactionRenounce, 'CFORemoved', ev => ev.account === addressCfo);
  });
});
