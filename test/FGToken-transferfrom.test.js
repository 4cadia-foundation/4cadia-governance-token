const helpers = require('./helpers');
const truffleAssertions = require('truffle-assertions');

contract('FGToken', accounts => {

  let listAccounts;
  let contract;

  beforeEach('beforeEach: transferfrom', async () => {

    listAccounts = helpers.parseAccounts(accounts);
    contract = await helpers.instanceContract(accounts);
    await contract.increaseForecast(1000, { from: listAccounts.CFO });
    await contract.mint(listAccounts.ALPHA, 1000, { from: listAccounts.CFO });

  });

  describe('allowance', () => {
    
    beforeEach(async () => {
      await contract.approve(listAccounts.BETA, 200, { from: listAccounts.ALPHA });
    });

    it('should return balance approved for account', async () => {
      const allowance = await contract.allowance(listAccounts.ALPHA, listAccounts.BETA);
      assert.equal(Number(allowance), 200);
    });

    it('should add new balance', async () => {
      await truffleAssertions.passes(contract.increaseAllowance(listAccounts.BETA, 100, { from: listAccounts.ALPHA }));
      const allowance = await contract.allowance(listAccounts.ALPHA, listAccounts.BETA);
      assert.equal(allowance.toNumber(), 300);
    });

    it('should fails for method increaseAllowance when token is paused', async () => {
      await contract.pause({ from: listAccounts.CEO });
      await truffleAssertions.fails(contract.increaseAllowance(listAccounts.BETA, 100, { from: listAccounts.ALPHA }), 'Pausable: paused');
    });

    it('should fails for method decreaseAllowance when token is paused', async () => {
      await contract.pause({ from: listAccounts.CEO });
      await truffleAssertions.fails(contract.decreaseAllowance(listAccounts.BETA, 100, { from: listAccounts.ALPHA }), 'Pausable: paused');
    });

    it('should decrease allowance', async () => {
      await truffleAssertions.passes(contract.decreaseAllowance(listAccounts.BETA, 100, { from: listAccounts.ALPHA }));
      const allowance = await contract.allowance(listAccounts.ALPHA, listAccounts.BETA);
      assert.equal(allowance.toNumber(), 100);
    });


  });

  describe('approve', () => {

    it('should execute a function approve', async () => {
      await truffleAssertions.passes(contract.approve(listAccounts.BETA, 200, { from: listAccounts.ALPHA }));
    });

    it('should fail when token is paused', async () => {
      await contract.pause({ from: listAccounts.CEO });
      await truffleAssertions.fails(contract.approve(listAccounts.BETA, 200, { from: listAccounts.ALPHA }), 'Pausable: paused');
    });

    it('should emit Approval event after approve', async () => {
      const approval = await contract.approve(listAccounts.BETA, 200, { from: listAccounts.ALPHA });
      truffleAssertions.eventEmitted(approval, 'Approval', ev => ev.owner === listAccounts.ALPHA && ev.spender === listAccounts.BETA && Number(ev.value) === 200);
    });
  });

  describe('transferFrom', () => {
    it('should transfer from other account after approve', async () => {
      await contract.approve(listAccounts.BETA, 200, { from: listAccounts.ALPHA });
      await truffleAssertions.passes(contract.transferFrom(listAccounts.ALPHA, listAccounts.GAMMA, 200, { from: listAccounts.BETA }));
    });

    it('should return insuficient funds', async () => {
      const data = helpers.descriptionSample();
      await contract.approve(listAccounts.BETA, 200, { from: listAccounts.ALPHA });
      await contract.transfer(listAccounts.GAMMA, 1000, data, { from: listAccounts.ALPHA });
      await truffleAssertions.fails(contract.transferFrom(listAccounts.ALPHA, listAccounts.GAMMA, 200, { from: listAccounts.BETA }), 'Insuficient funds');
    });

  });
});
