const FGToken = artifacts.require('FGToken');
const { should } = require('./helpers');
const truffleAssertions = require('truffle-assertions');

contract('FGToken', accounts => {
  beforeEach(async () => {
    this.token = await FGToken.new('FGToken', 'FGT', 8, 1000);
  });

  it('should initialize token with not pausable', async () => {
    const paused = await this.token.paused();
    assert.equal(paused, false);
  });

  describe('pause', () => {
    it('should execute the method pause', async () => {
      await truffleAssertions.passes(this.token.pause());
    });

    it('should return not pausable role', async () => {
      await truffleAssertions.reverts(this.token.pause({ from: accounts[1] }), 'caller does not have the Pauser role');
    });

    it('should emit event Paused when pause method executed', async () => {
      const pauseTransaction = await this.token.pause();
      await truffleAssertions.eventEmitted(pauseTransaction, 'Paused', ev => ev.account === accounts[0]);
    });
  });

  describe('unpause', () => {
    it('should execute the method unpause', async () => {
      await this.token.pause();
      await truffleAssertions.passes(this.token.unpause());
    });

    it('should return does not have the Pauser role', async () => {
      await this.token.pause();
      await truffleAssertions.reverts(this.token.unpause({ from: accounts[1] }), 'caller does not have the Pauser role');
    });

    it('should return not paused when execute method unpause', async () => {
      await truffleAssertions.reverts(this.token.unpause(), 'not paused');
    });

    it('should emit event Unpaused when pause method executed', async () => {
      await this.token.pause();
      const unpausedTransaction = await this.token.unpause();
      await truffleAssertions.eventEmitted(unpausedTransaction, 'Unpaused', ev => ev.account === accounts[0]);
    });
  });

  describe('PauserRole', () => {
    it('should add new account of pauser role', async () => {
      await truffleAssertions.passes(this.token.addPauser(accounts[1]));
    });

    it('should fail transaction account already has role', async () => {
      await truffleAssertions.fails(this.token.addPauser(accounts[0]), 'Roles: account already has role');
    });

    it('should fail transaction account is paused', async () => {
      await truffleAssertions.fails(this.token.addPauser(accounts[0], { from: accounts[3] }), 'PauserRole: caller does not have the Pauser role');
    });

    it('should remove account of pauser role', async () => {
      await this.token.addPauser(accounts[1]);
      await truffleAssertions.passes(this.token.renouncePauser({ from: accounts[1] }));
    });

    it('should return if account is Pauser', async () => {
      const isPauser = await this.token.isPauser(accounts[0]);
      assert.equal(isPauser, true);
    });

    it('should emit event PauserAdded', async () => {
      const isPauser = await this.token.isPauser(accounts[0]);
      assert.equal(isPauser, true);
    });

    it('should emit event for PauserAdded', async () => {
      const pauserTransaction = await this.token.addPauser(accounts[1]);
      truffleAssertions.eventEmitted(pauserTransaction, 'PauserAdded', ev => ev.account == accounts[1]);
    });

    it('should emit event for PauserRemoved', async () => {
      const pauserTransaction = await this.token.renouncePauser({ from: accounts[0] });
      truffleAssertions.eventEmitted(pauserTransaction, 'PauserRemoved', ev => ev.account == accounts[0]);
    });
  });
});
