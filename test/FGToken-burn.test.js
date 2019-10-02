const FGToken = artifacts.require('FGToken');
const truffleAssertions = require('truffle-assertions');

contract('FGToken', accounts => {
  const _initialSupply = 1000;

  beforeEach(async () => {
    this.token = await FGToken.new('FGToken', 'FGT', 8, _initialSupply);
  });

  it('should get the totalsupply', async () => {
    const totalSupply = await this.token.totalSupply();
    assert.equal(totalSupply, _initialSupply);
  });

  it('should execute method burn with success', async () => {
    await truffleAssertions.passes(this.token.burn(10));
  });

  it('should fails for method burn when token is paused', async () => {
    await this.token.pause();
    await truffleAssertions.fails(this.token.burn(10), 'Pausable: paused');
  });

  it('should fails for account of not is an owner', async () => {
    await truffleAssertions.fails(this.token.burn(100, { from: accounts[3] }), 'CFORole: caller does not have the CFO role');
  });

  it('should return insuficient funds', async () => {
    await truffleAssertions.reverts(this.token.burn(9000), 'Insuficient funds');
  });

  it('should substract the balance of totalsupply', async () => {
    await this.token.burn(100);
    const totalSupply = await this.token.totalSupply();
    assert.equal(totalSupply, _initialSupply - 100);
  });

  it('should emit event for burn', async () => {
    const burnTransaction = await this.token.burn(100);
    truffleAssertions.eventEmitted(burnTransaction, 'Burn', ev => ev.burner === accounts[0] && Number(ev.value) === 100);
  });
});
