const FGToken = artifacts.require('FGToken');
const { name, symbol, decimals, maxCap } = require('./helpers');

contract('FGToken', accounts => {

  let token;
  const addressCreator = accounts[0];

  beforeEach('test', async () => {
    token = await FGToken.new(name, symbol, decimals, maxCap);
  });

  describe('Constructor', () => {

    it('token creator is CEO', async () => {
      const response = await token.isCEO(addressCreator);
      assert.equal(response, true, "token creator must be CEO");
    });

    it('token creator is MaxCapManager', async () => {
      const response = await token.isMaxCapManager(addressCreator);
      assert.equal(response, true, "token creator must be MaxCapManager");
    });

    it('token creator is not CFO', async () => {
      const response = await token.isCFO(addressCreator);
      assert.equal(response, false, "token creator cannot be CFO");
    });

    it('token creator is not in Whitelist', async () => {
      const response = await token.isWhitelisted(addressCreator);
      assert.equal(response, false, "token creator cannot be in Whitelist");
    });

    it("should have initial supply equal zero", async () => {
      const response = await token.totalSupply();
      assert.equal(response, 0, 'initial supply must be zero');
    });

    it("should have forecast equal zero at creation", async () => {
      const response = await token.forecast();
      assert.equal(response, 0, 'forecast must be zero at creation');
    });

  });
});
