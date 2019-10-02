const FGToken = artifacts.require('FGToken');
const truffleAssertions = require('truffle-assertions');

contract('FGToken', accounts => {
  const _name = 'FGToken';
  const _symbol = 'FGT';
  const _decimals = 8;
  const _initialSupply = 0;

  beforeEach(async () => {
    this.token = await FGToken.new(_name, _symbol, _decimals, _initialSupply);
  });

  describe('Mintable - Create', function () {
    it('creator address is Minter at create', async () => {
      const owner = accounts[0];
      const isMinter = await this.token.isMinter(owner);
      assert.equal(isMinter, true, 'owner has not Minter role');
    });

    it('other address cannot be Minter at create', async () => {
      const nonowner = accounts[1];
      const isMinter = await this.token.isMinter(nonowner);
      assert.equal(isMinter, false, 'nonowner has Minter role');
    });
  });

  describe('Mintable - Mint', function () {
    it('Owner can mint', async () => {
      const owner = accounts[0];
      const nonowner = accounts[1];
      const amount = 10;
      await truffleAssertions.passes(this.token.mint(nonowner, amount, { from: owner }));
    });

    it('nonowner cannot mint', async () => {
      const nonowner1 = accounts[1];
      const nonowner2 = accounts[2];
      const amount = 10;
      await truffleAssertions.reverts(this.token.mint(nonowner1, amount, { from: nonowner2 }));
    });
  });

  describe('Mintable - Minter Role', function () {
    it('Minter can addMinter', async () => {
      const owner = accounts[0];
      const nonowner = accounts[1];
      await truffleAssertions.passes(this.token.addMinter(nonowner, { from: owner }));
    });

    it('nonMinter cannot addMinter', async () => {
      const nonowner1 = accounts[1];
      const nonowner2 = accounts[2];
      await truffleAssertions.reverts(this.token.addMinter(nonowner1, { from: nonowner2 }));
    });

    it('Minter can removeMinter', async () => {
      const owner = accounts[0];
      const nonowner = accounts[1];
      this.token.addMinter(nonowner, { from: owner });
      await truffleAssertions.passes(this.token.removeMinter(nonowner, { from: owner }));
    });

    it('nonMinter cannot removeMinter', async () => {
      const owner = accounts[0];
      const nonowner1 = accounts[1];
      const nonowner2 = accounts[2];
      this.token.addMinter(nonowner1, { from: owner });
      await truffleAssertions.reverts(this.token.removeMinter(nonowner1, { from: nonowner2 }));
    });

    it('Minter can renounceMinter', async () => {
      const owner = accounts[0];
      await truffleAssertions.passes(this.token.renounceMinter({ from: owner }));
    });

    it('nonMinter cannot renounceMinter', async () => {
      const nonowner1 = accounts[1];
      await truffleAssertions.reverts(this.token.renounceMinter({ from: nonowner1 }));
    });
  });
});
