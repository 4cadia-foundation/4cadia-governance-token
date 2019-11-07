const FGToken = artifacts.require('FGToken');
const truffleAssertions = require('truffle-assertions');

const {
  name, symbol, decimals, maxCap
} = require('./helpers');  


contract('FGToken', accounts => {

  let token;
  const addressCreator = accounts[0];

  beforeEach('test', async () => {
    token = await FGToken.new(name, symbol, decimals, maxCap);
  });

  describe('Constructor', () => {
        
    it('token creator is CEO', async () => {
      const response = await token.isCEO(addressCreator);
      var expected = true;
      assert.equal(response, expected, "token creator must be CEO");
    });

    it('token creator is MaxCapManager', async () => {
      const response = await token.isMaxCapManager(addressCreator);
      var expected = true;
      assert.equal(response, expected, "token creator must be MaxCapManager");
    });

    it('token creator is Compliance', async () => {
      const response = await token.isCompliance(addressCreator);
      var expected = true;
      assert.equal(response, expected, "token creator must be ComplianceRole");
    });

    it('token creator is not CFO', async () => {
      const response = await token.isCFO(addressCreator);
      var expected = false;
      assert.equal(response, expected, "token creator cannot be CFO");
    });

    it('token creator is not in Whitelist', async () => {
      const response = await token.isWhitelisted(addressCreator);
      var expected = false;
      assert.equal(response, expected, "token creator cannot be in Whitelist");
    });

    it("should have initial supply equal zero", async() => {
      var response = await token.totalSupply();
      var expected = 0;
      assert.equal(response, expected, 'initial supply must be zero');
    })

    it("should have forecast equal zero at creation", async() => {
      var response = await token.forecast();
      var expected = 0;
      assert.equal(response, expected, 'forecast must be zero at creation');
    });

  });
});
