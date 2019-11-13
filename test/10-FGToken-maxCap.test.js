const helpers = require('./helpers');
const FGToken = artifacts.require('FGToken');
const truffleAssertions = require('truffle-assertions');

const { name, symbol, decimals, maxCap, amount, forecastDuration } = require('./helpers'); 


contract('FGToken', accounts => {

  let token;
  let listAccounts = helpers.parseAccounts(accounts);

  beforeEach(async () => {
    token = await FGToken.new(name, symbol, decimals, maxCap, forecastDuration, { from: listAccounts.CEO });
    await token.addMaxCapManager(listAccounts.MaxCapManager, { from: listAccounts.CEO });
  });

  describe('increase maxCap', () => {

    it('increaseMaxCap', async () => {
      await truffleAssertions.passes(token.increaseMaxCap(amount, { from: listAccounts.MaxCapManager }));
    });

    it('check maxCap value after increaseMaxCap', async () => {
      var maxCapBefore = await token.maxCap();
      await token.increaseMaxCap(amount, { from: listAccounts.MaxCapManager });
      var maxCapAfter = await token.maxCap();      
      assert.equal(Number(maxCapBefore) + amount, Number(maxCapAfter));
    });

    it('increaseMaxCap failed from account not in MaxCapRole', async () => {
      await truffleAssertions.fails(token.increaseMaxCap(amount, { from: listAccounts.OtherAddress }), 'MaxCapRole: onlyMaxCapManager');
    });

    it('increaseMaxCap should fails when token is paused', async () => {
      await token.pause({ from: listAccounts.CEO });
      await truffleAssertions.fails(token.increaseMaxCap(amount, { from: listAccounts.MaxCapManager }), 'Pausable: paused');
    });    

    it('should emit event MaxCapChange when increase maxCap', async () => {
      var maxCapBefore = await token.maxCap();
      const transaction = await token.increaseMaxCap(amount, { from: listAccounts.MaxCapManager });
      var maxCapAfter = await token.maxCap(); 
      await truffleAssertions.eventEmitted(transaction, 'MaxCapChange',
        event => Number(event.oldValue) === Number(maxCapBefore) && Number(event.newValue) === Number(maxCapAfter));
    });

  });

  describe('decreaseMaxCap', () => {  

    it('decrease maxCap', async () => {
      await token.increaseMaxCap(amount, { from: listAccounts.MaxCapManager });
      await truffleAssertions.passes(token.decreaseMaxCap(amount, { from: listAccounts.MaxCapManager }));
    });

    it('check maxCap value after decreaseMaxCap', async () => {
      await token.increaseMaxCap(amount, { from: listAccounts.MaxCapManager });
      var maxCapBefore = await token.maxCap();
      await token.decreaseMaxCap(amount, { from: listAccounts.MaxCapManager });
      var maxCapAfter = await token.maxCap();      
      assert.equal(Number(maxCapBefore), Number(maxCapAfter) + amount);
    });

    it('decreaseMaxCap failed from account not in MaxCapRole', async () => {
      await token.increaseMaxCap(amount, { from: listAccounts.MaxCapManager });
      await truffleAssertions.fails(token.decreaseMaxCap(amount, { from: listAccounts.OtherAddress }), 'MaxCapRole: onlyMaxCapManager');
    });

    it('decreaseMaxCap failed if maxCap is less than zero', async () => {
      var maxCapBefore = await token.maxCap();
      //SafeMath: subtraction overflow
      await truffleAssertions.fails(token.decreaseMaxCap(Number(maxCapBefore) + 1, { from: listAccounts.MaxCapManager }));
    });

    it('decreaseMaxCap failed if maxCap is less than totalSupply', async () => {
      await token.addCFO(listAccounts.CFO, { from: listAccounts.CEO });
      var value = await token.maxCap();
      await token.increaseForecast(value, { from: listAccounts.CFO });
      await token.mint(listAccounts.CFO, value, { from: listAccounts.CFO });  
      var totalSupply = await token.totalSupply();
      //SafeMath: subtraction overflow
      await truffleAssertions.fails(token.decreaseMaxCap(Number(totalSupply) + 1, { from: listAccounts.MaxCapManager }));
    });

    it('decreaseMaxCap should fails when token is paused', async () => {
      await token.increaseMaxCap(amount, { from: listAccounts.MaxCapManager });
      await token.pause({ from: listAccounts.CEO });
      await truffleAssertions.fails(token.decreaseMaxCap(amount, { from: listAccounts.MaxCapManager }), 'Pausable: paused');
    });    

    it('should emit event MaxCapChange when decrease maxCap', async () => {
      await token.increaseMaxCap(amount, { from: listAccounts.MaxCapManager });
      var maxCapBefore = await token.maxCap();
      const transaction = await token.decreaseMaxCap(amount, { from: listAccounts.MaxCapManager });
      var maxCapAfter = await token.maxCap(); 
      await truffleAssertions.eventEmitted(transaction, 'MaxCapChange', 
        event => Number(event.oldValue) === Number(maxCapBefore) && Number(event.newValue) === Number(maxCapAfter));
    });

  });

});
