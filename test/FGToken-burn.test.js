const FGToken = artifacts.require('FGToken');
const truffleAssertions = require('truffle-assertions');

contract('FGToken', accounts => {
  const maxCap = 1000;
  const accountCFO = accounts[1];

  beforeEach(async () => {
    this.token = await FGToken.new('FGToken', 'FGT', 8, 1000);
    await this.token.addCFO(accountCFO, { from: accounts[0] });
    await this.token.increaseForecast(1000, { from: accountCFO });
    await this.token.mint(accountCFO, 1000, { from: accountCFO });
  });

  it('should get the totalsupply', async () => {
    const totalSupply = await this.token.totalSupply();
    assert.equal(totalSupply, maxCap);
  });

  it('should execute method burn with success', async () => {
    await truffleAssertions.passes(this.token.burn(10, { from: accountCFO }));
  });

  it('should fails for method burn when token is paused', async () => {
    await this.token.pause();
    await truffleAssertions.fails(this.token.burn(10, { from: accountCFO }), 'Pausable: paused');
  });

  it('should fails for account of not is an owner', async () => {
    await truffleAssertions.fails(this.token.burn(100, { from: accounts[3] }), 'CFORole: caller does not have the CFO role');
  });

  it('should return insuficient funds', async () => {
    await truffleAssertions.reverts(this.token.burn(9000, { from: accountCFO }), 'Insuficient funds');
  });

  it('should substract the balance of totalsupply', async () => {
    await this.token.burn(100, { from: accountCFO });
    const totalSupply = await this.token.totalSupply();
    assert.equal(totalSupply, maxCap - 100);
  });

  it('should emit event for burn', async () => {
    const burnTransaction = await this.token.burn(100, { from: accountCFO });
    truffleAssertions.eventEmitted(burnTransaction, 'Burn', ev => ev.burner === accountCFO && Number(ev.value) === 100);
  });
});
