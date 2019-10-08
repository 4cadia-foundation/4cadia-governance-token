const FGToken = artifacts.require('FGToken');
const truffleAssertions = require('truffle-assertions');

contract('FGToken', accounts => {
  const _name = 'FGToken';
  const _symbol = 'FGT';
  const _decimals = 8;
  const _maxCap = 0;

  let accountOwner;
  let accountNoOwner;
  let amount;

  describe('at Mint', () => {
    beforeEach('minting', async () => {
      accountOwner = accounts[0];
      accountNoOwner = accounts[1];
      accountNoOwner = accounts[2];
      amount = 100;

      this.token = await FGToken.new(_name, _symbol, _decimals, 1000, { from: accountOwner });
      await this.token.increaseForecast(amount);
    });

    it('should fail if account has not properly role', async () => {
      await truffleAssertions.fails(this.token.mint(amount, { from: accountNoOwner }), 'CFORole: caller does not have the CFO role');
    });

    it('should get the totalsupply', async () => {
      const totalSupply = await this.token.totalSupply();
      assert.equal(totalSupply, _maxCap);
    });

    describe('when address has properly role', () => {
      it('should execute method mint with success', async () => {
        await truffleAssertions.passes(this.token.mint(amount));
      });

      it('should fails for method mint when token is paused', async () => {
        await this.token.pause();
        await truffleAssertions.reverts(this.token.mint(amount), 'Pausable: paused');
      });

      it('should add the balance of totalsupply', async () => {
        await this.token.mint(amount);
        const totalSupply = await this.token.totalSupply();
        assert.equal(totalSupply, _maxCap + amount);
      });

      it('should emit event for mint', async () => {
        const mintTransaction = await this.token.mint(amount);
        truffleAssertions.eventEmitted(mintTransaction, 'Mint', ev => ev.minter === accountOwner && Number(ev.value) === amount);
      });
    });
  });
});
