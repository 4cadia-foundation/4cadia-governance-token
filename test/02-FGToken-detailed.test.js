const FGToken = artifacts.require('FGToken');

const {
  name, symbol, decimals, maxCap
} = require('./helpers'); 


contract('FGToken', () => {

  beforeEach(async () => {
    this.token = await FGToken.new(name, symbol, decimals, maxCap);
  });

  describe('Token Attributes', () => {
    it('has the correct name', async () => {
      const response = await this.token.name();
      name.should.equal(response);
    });

    it('has the correct symbol', async () => {
      const response = await this.token.symbol();
      symbol.should.equal(response);
    });

    it('has the correct decimals', async () => {
      const response = await this.token.decimals();
      assert.equal(decimals, response);
    });
  });
});
