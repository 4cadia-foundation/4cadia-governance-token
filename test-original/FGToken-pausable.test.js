const FGToken = artifacts.require('FGToken');
const truffleAssertions = require('truffle-assertions');

contract('FGToken', accounts => {
  
  let accountOwner;
  let accountCEO;
  let accountCFO;

  beforeEach(async () => {
    accountOwner = accounts[0];
    accountCEO = accounts[1];
    accountCFO = accounts[2];

    this.token = await FGToken.new('FGToken', 'FGT', 8, 1000);
    await this.token.addCEO(accountCEO, { from: accountOwner });
    await this.token.addCEO(accountCFO, { from: accountCEO });
  });

  it('should initialize token with not pausable', async () => {
    const paused = await this.token.paused();
    assert.equal(paused, false);
  });

  describe('pause', () => {
    it('should execute the method pause', async () => {
      await truffleAssertions.passes(this.token.pause({ from: accountCEO }));
    });

    it('should return not pausable role', async () => {
      await truffleAssertions.fails(this.token.pause({ from: accounts[4] }), 'CEORole: caller does not have the CEO role');
    });

    it('should emit event Paused when pause method executed', async () => {
      const pauseTransaction = await this.token.pause({ from: accountCEO });
      await truffleAssertions.eventEmitted(pauseTransaction, 'Paused', ev => ev.account === accountCEO);
    });
  });

  describe('unpause', () => {
    it('should execute the method unpause', async () => {
      await this.token.pause({ from: accountCEO });
      await truffleAssertions.passes(this.token.unpause({ from: accountCEO }));
    });

    it('should return does not have the Pauser role', async () => {
      await this.token.pause({ from: accountCEO });
      await truffleAssertions.fails(this.token.unpause({ from: accounts[3] }), 'CEORole: caller does not have the CEO role');
    });

    it('should return not paused when execute method unpause', async () => {
      await truffleAssertions.reverts(this.token.unpause({ from: accountCEO }), 'not paused');
    });

    it('should emit event Unpaused when pause method executed', async () => {
      await this.token.pause({ from: accountCEO });
      const unpausedTransaction = await this.token.unpause({ from: accountCEO });
      await truffleAssertions.eventEmitted(unpausedTransaction, 'Unpaused', ev => ev.account === accountCEO);
    });
  });
});
