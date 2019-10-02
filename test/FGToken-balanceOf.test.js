const FGToken = artifacts.require('FGToken');
const truffleAssertions = require('truffle-assertions');

contract('FGToken', accounts => {
  beforeEach(async () => {
    this.token = await FGToken.new('FGToken', 'FGT', 8, 1000);
    this.accountOwner = accounts[0];
  });

  describe('balanceOf', () => {
    it('should call balanceOf method successfully', async () => {
      await truffleAssertions.passes(this.token.balanceOf(this.accountOwner));
    });

    it('should return owner account balance amount', async () => {
      const balanceOf = await this.token.balanceOf(this.accountOwner);
      assert.equal(balanceOf.toNumber(), 1000);
    });

    it('should return the balance zero for account 1', async () => {
      const balanceOf = await this.token.balanceOf(accounts[1]);
      assert.equal(balanceOf.toNumber(), 0);
    });

    it('should fail when account not is a address', async () => {
      await truffleAssertions.fails(this.token.balanceOf(1), 'invalid address');
    });

    it('should return balance of other account after execute transfer', async () => {
      assert.equal(Number(await this.token.balanceOf(accounts[1])), 0);
      await this.token.transfer(accounts[1], 500);
      assert.equal(Number(await this.token.balanceOf(accounts[1])), 500);
    });
  });
});
