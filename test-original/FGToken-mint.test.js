const FGToken = artifacts.require('FGToken');
const truffleAssertions = require('truffle-assertions');

contract('FGToken', accounts => {
  const _name = 'FGToken';
  const _symbol = 'FGT';
  const _decimals = 8;
  const _maxCap = 0;

  let accountOwner;
  let accountNoOwner;
  let accountAlpha;
  let accountBetha;
  let addressCEO;
  let accountCFO;
  let amount;

  describe('at Mint', () => {
    beforeEach('minting', async () => {
      accountOwner = accounts[0];
      addressCEO = accounts[1];
      accountCFO = accounts[2];
      accountNoOwner = accounts[3];
      accountAlpha = accounts[4];
      accountBetha = accounts[5];
      amount = 100;

      this.token = await FGToken.new(_name, _symbol, _decimals, 1000);

      await this.token.addCEO(addressCEO, { from: accountOwner });
      await this.token.addCFO(accountCFO, { from: addressCEO });
      await this.token.increaseForecast(amount, { from: accountCFO });
    });

    it('should fail if account has not properly role', async () => {
      await truffleAssertions.fails(this.token.mint(accountOwner, amount, { from: accountNoOwner }), 'CFORole: caller does not have the CFO role');
    });

    it('should get the totalsupply', async () => {
      const totalSupply = await this.token.totalSupply();
      assert.equal(totalSupply, _maxCap);
    });

    describe('when address has properly role', () => {
      it('should execute method mint with success', async () => {
        await truffleAssertions.passes(this.token.mint(accountOwner, amount, { from: accountCFO }));
      });

      it('should execute method mint for other account with success', async () => {
        await truffleAssertions.passes(this.token.mint(accountNoOwner, amount, { from: accountCFO }));
      });

      it('should fails for method mint when token is paused', async () => {
        await this.token.pause({ from: addressCEO });
        await truffleAssertions.reverts(this.token.mint(accountAlpha, amount, { from: accountCFO }), 'Pausable: paused');
      });

      it('should add the balance of totalsupply', async () => {
        await this.token.mint(accountAlpha, amount, { from: accountCFO });
        const totalSupply = await this.token.totalSupply();
        assert.equal(totalSupply, _maxCap + amount);
      });

      it('should emit event for mint', async () => {
        const mintTransaction = await this.token.mint(accountOwner, amount, { from: accountCFO });
        truffleAssertions.eventEmitted(mintTransaction, 'Mint', ev => ev.minter === accountOwner && Number(ev.value) === amount);
      });

    });
  });
});
