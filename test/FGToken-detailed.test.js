const FGToken = artifacts.require('FGToken');

contract('FGToken', () => {
  const _name = 'FGToken';
  const _symbol = 'FGT';
  const _decimals = 8;
  const _initialSupply = 0;

  beforeEach(async () => {
    this.token = await FGToken.new(_name, _symbol, _decimals, _initialSupply);
  });

  describe('Token Attributes', () => {
    it('has the correct name', async () => {
      const name = await this.token.name();
      name.should.equal(_name);
    });

    it('has the correct symbol', async () => {
      const symbol = await this.token.symbol();
      symbol.should.equal(_symbol);
    });

    it('has the correct decimals', async () => {
      const decimals = await this.token.decimals();
      assert.equal(decimals, _decimals);
    });
  });
});
