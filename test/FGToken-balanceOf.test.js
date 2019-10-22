const FGToken = artifacts.require('FGToken');
const truffleAssertions = require('truffle-assertions');

contract('FGToken', accounts => {
  beforeEach(async () => {
    this.accountOwner = accounts[0];
    this.accountCFO = accounts[1];

    this.token = await FGToken.new('FGToken', 'FGT', 8, 1000);
    await this.token.addCFO(this.accountCFO);
    await this.token.increaseForecast(1000, { from: this.accountCFO });
    await this.token.mint(this.accountCFO, 1000, { from: this.accountCFO });

  });

  describe('balanceOf', () => {
    it('should call balanceOf method successfully', async () => {
      await truffleAssertions.passes(this.token.balanceOf(this.accountCFO));
    });

    it('should return owner account balance amount', async () => {
      const balanceOf = await this.token.balanceOf(this.accountCFO);
      assert.equal(balanceOf.toNumber(), 1000);
    });

    it('should return the balance zero for account 1', async () => {
      const balanceOf = await this.token.balanceOf(accounts[0]);
      assert.equal(balanceOf.toNumber(), 0);
    });

    it('should fail when account not is a address', async () => {
      await truffleAssertions.fails(this.token.balanceOf(1), 'invalid address');
    });

    it('should return balance of other account after execute transfer', async () => {
      assert.equal(Number(await this.token.balanceOf(accounts[2])), 0);
      const _data = new Uint8Array([83, 97, 109, 112, 108, 101, 32, 68, 97, 116, 97]);
      await this.token.transfer(accounts[2], 500, _data, {from: this.accountCFO});
      assert.equal(Number(await this.token.balanceOf(accounts[2])), 500);
    });
  });
});
