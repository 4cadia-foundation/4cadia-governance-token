const FGToken = artifacts.require('FGToken');
const truffleAssertions = require('truffle-assertions');

contract('FGToken', accounts => {
  const _name = 'FGToken';
  const _symbol = 'FGT';
  const _decimals = 8;
  const _initialSupply = 0;

  let accountOwner;
  let accountNoOwner;
  let accountNoOwner2;
  let amount;

  describe('Mintable Functions', () => {
    beforeEach(async () => {
      accountOwner = accounts[0];
      accountNoOwner = accounts[1];
      accountNoOwner2 = accounts[2];
      amount = 10;

      this.token = await FGToken.new(_name, _symbol, _decimals, _initialSupply, { from: accountOwner });
    });

    describe('when create', () => {
      it('should have the contract owner with properly role', async () => {
        const isCFO = await this.token.isCFO(accountOwner);
        assert.equal(isCFO, true, 'this address has not permission to mint');
      });
    });

    describe('when mint', () => {
      it('should pass if account has properly role', async () => {
        await truffleAssertions.passes(this.token.mint(accountNoOwner, amount, { from: accountOwner }));
      });
      it('should fail if account has not properly role', async () => {
        await truffleAssertions.reverts(this.token.mint(accountNoOwner, amount, { from: accountNoOwner2 }));
      });
    });
  });
});
