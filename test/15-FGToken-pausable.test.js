const helpers = require('./helpers');
const FGToken = artifacts.require('FGToken');
const BalanceContract = artifacts.require('BalanceContract');
const truffleAssertions = require('truffle-assertions');

const {name, symbol, decimals, maxCap, forecastDuration} = require('./helpers');  


contract('FGToken', accounts => {

  let token;
  let listAccounts = helpers.parseAccounts(accounts);

  beforeEach('test', async () => {
    token = await FGToken.new(name, symbol, decimals, maxCap, forecastDuration, { from: listAccounts.CEO });
    await token.addCFO(listAccounts.CFO, { from: listAccounts.CEO });
  });

  describe('init', () => {
    it('should verify if it is paused', async () => {
      await truffleAssertions.passes(token.paused());
    });

    it('should initialize token with not pausable', async () => {
      const paused = await token.paused();
      assert.equal(paused, false);
    });
  });

  describe('pause', () => {
    it('should execute the method pause', async () => {
      await truffleAssertions.passes(token.pause({ from: listAccounts.CEO }));
    });

    it('should fail if not pausable role', async () => {
      await truffleAssertions.fails(token.pause({ from: listAccounts.User }), 'CEORole: onlyCEO');
    });

    it('should fail if it is already paused', async () => {
      await token.pause({ from: listAccounts.CEO });
      await truffleAssertions.reverts(token.pause({ from: listAccounts.CEO }), 'Pausable: paused');
    });

    it('should emit event Paused when pause method executed', async () => {
      const transaction = await token.pause({ from: listAccounts.CEO });
      await truffleAssertions.eventEmitted(transaction, 'Paused', ev => ev.account === listAccounts.CEO);
    });
  });

  describe('unpause', () => {
    it('should execute the method unpause', async () => {
      await token.pause({ from: listAccounts.CEO });
      await truffleAssertions.passes(token.unpause({ from: listAccounts.CEO }));
    });

    it('should fail if not pausable role', async () => {
      await token.pause({ from: listAccounts.CEO });
      await truffleAssertions.fails(token.unpause({ from: listAccounts.User }), 'CEORole: onlyCEO');
    });

    it('should fail if it is already unpaused', async () => {
      await truffleAssertions.reverts(token.unpause({ from: listAccounts.CEO }), 'Pausable: not paused');
    });

    it('should emit event Unpaused when pause method executed', async () => {
      await token.pause({ from: listAccounts.CEO });
      const transaction = await token.unpause({ from: listAccounts.CEO });
      await truffleAssertions.eventEmitted(transaction, 'Unpaused', ev => ev.account === listAccounts.CEO);
    });
  });

});
