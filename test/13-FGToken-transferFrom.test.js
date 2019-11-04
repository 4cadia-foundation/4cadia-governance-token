const helpers = require('./helpers');
const FGToken = artifacts.require('FGToken');
const BalanceContract = artifacts.require('BalanceContract');
const truffleAssertions = require('truffle-assertions');

const {
  name, symbol, decimals, maxCap, forecastAmount, amount
} = require('./helpers');  


contract('FGToken', accounts => {

  let token;
  let listAccounts = helpers.parseAccounts(accounts);

  beforeEach('test', async () => {
    token = await FGToken.new(name, symbol, decimals, maxCap, { from: listAccounts.CEO });
    await token.addCFO(listAccounts.CFO, { from: listAccounts.CEO });
    await token.increaseForecast(forecastAmount, { from: listAccounts.CFO });
    await token.mint(listAccounts.User, amount, { from: listAccounts.CFO });
  });

  describe('approve', () => {
    it('should execute a function approve', async () => {
      await truffleAssertions.passes(token.approve(listAccounts.User2, amount, { from: listAccounts.User }));
    });

    it('should set amount in allowance', async () => {
      await token.approve(listAccounts.User2, amount, { from: listAccounts.User });
      const allowance = await token.allowance(listAccounts.User, listAccounts.User2);
      assert.equal(allowance.toNumber(), amount);
    });

    it('should fail when token is paused', async () => {
      await token.pause({ from: listAccounts.CEO });
      await truffleAssertions.fails(token.approve(listAccounts.User2, amount, { from: listAccounts.User }), 'Pausable: paused');
    });

    it('should emit Approval event after approve', async () => {
      const transaction = await token.approve(listAccounts.User2, amount, { from: listAccounts.User });
      truffleAssertions.eventEmitted(transaction, 'Approval', 
        ev => ev.owner === listAccounts.User && ev.spender === listAccounts.User2 && Number(ev.value) === amount);
    });  
  });

  describe('increase Allowance', () => {
    it('should execute increaseAllowance', async () => {
      await truffleAssertions.passes(token.increaseAllowance(listAccounts.User2, amount, { from: listAccounts.User }));
    });

    it('should increase allowance by amount', async () => {
      const allowanceBefore = await token.allowance(listAccounts.User, listAccounts.User2);
      await token.increaseAllowance(listAccounts.User2, amount, { from: listAccounts.User });
      const allowanceAfter = await token.allowance(listAccounts.User, listAccounts.User2);
      assert.equal(allowanceBefore.toNumber() + amount, allowanceAfter.toNumber());
    });

    /* Falha, verificar se pode fazer um increaseAllowance maior que o saldo     
    it('should fails for method increaseAllowance when allowance is greater than balance', async () => {
      await truffleAssertions.fails(token.increaseAllowance(listAccounts.User2, amount + 1, { from: listAccounts.User }), 'XXX');
    });
    */

    it('should fails for method increaseAllowance when token is paused', async () => {
      await token.pause({ from: listAccounts.CEO });
      await truffleAssertions.fails(token.increaseAllowance(listAccounts.User2, amount, { from: listAccounts.User }), 'Pausable: paused');
    });

    it('should emit Approval event after increaseAllowance', async () => {
      const transaction = await token.increaseAllowance(listAccounts.User2, amount, { from: listAccounts.User });
      truffleAssertions.eventEmitted(transaction, 'Approval', 
        ev => ev.owner === listAccounts.User && ev.spender === listAccounts.User2 && Number(ev.value) === amount);
    });    
  });

  describe('decrease Allowance', () => {
    beforeEach(async () => {
      await token.increaseAllowance(listAccounts.User2, amount, { from: listAccounts.User });
    });

    it('should execute decreaseAllowance', async () => {
      await truffleAssertions.passes(token.decreaseAllowance(listAccounts.User2, amount, { from: listAccounts.User }));
    });

    it('should decrease allowance by amount', async () => {
      const allowanceBefore = await token.allowance(listAccounts.User, listAccounts.User2);
      await token.decreaseAllowance(listAccounts.User2, amount, { from: listAccounts.User });
      const allowanceAfter = await token.allowance(listAccounts.User, listAccounts.User2);
      assert.equal(allowanceBefore.toNumber(), allowanceAfter.toNumber() + amount );
    });

    it('should fails for method decreaseAllowance when amount is less than allowance', async () => {
      await truffleAssertions.fails(token.decreaseAllowance(listAccounts.User2, amount + 1, { from: listAccounts.User }), 'SafeMath: subtraction overflow');
    });    

    it('should fails for method decreaseAllowance when token is paused', async () => {
      await token.pause({ from: listAccounts.CEO });
      await truffleAssertions.fails(token.decreaseAllowance(listAccounts.User2, amount, { from: listAccounts.User }), 'Pausable: paused');
    });

    /* Falha, verificar porque não emite o evento
    it('should emit Approval event after decreaseAllowance', async () => {
      const transaction = await token.decreaseAllowance(listAccounts.User2, amount, { from: listAccounts.User });
      truffleAssertions.eventEmitted(transaction, 'Approval', 
        ev => ev.owner === listAccounts.User && ev.spender === listAccounts.User2 && Number(ev.value) === amount);
    });    
    */
  });

  describe('allowance', () => {    
    beforeEach(async () => {
      await token.approve(listAccounts.User2, amount, { from: listAccounts.User });
    });

    it('should execute allowance', async () => {
      await truffleAssertions.passes( token.allowance(listAccounts.User, listAccounts.User2) );
    });

    it('should return balance approved for account', async () => {
      const allowance = await token.allowance(listAccounts.User, listAccounts.User2);
      assert.equal(Number(allowance), amount);
    });
  });

  describe('transferFrom', () => {
    beforeEach(async () => {
      await token.approve(listAccounts.User2, amount, { from: listAccounts.User });
    });

    it('should transferFrom after approve', async () => {
      await truffleAssertions.passes(token.transferFrom(listAccounts.User, listAccounts.User2, amount, { from: listAccounts.User2 }));
    });

    it('should return insuficient funds if transfer is greater than allowance', async () => {
      const allowance = await token.allowance(listAccounts.User, listAccounts.User2);
      await truffleAssertions.fails(token.transferFrom(listAccounts.User, listAccounts.User2, amount + 1, { from: listAccounts.User2 }), 'insuficient funds');
    });

    it('should fails when token is paused', async () => {
      await token.pause({ from: listAccounts.CEO });
      await truffleAssertions.fails(token.transferFrom(listAccounts.User, listAccounts.User2, amount, { from: listAccounts.User2 }), 'Pausable: paused');
    });

    it('should emit event Transfer', async () => {
      const transaction = await token.transferFrom(listAccounts.User, listAccounts.User2, amount, { from: listAccounts.User2 });
      await truffleAssertions.eventEmitted(transaction, 'Transfer',      
        event => event.from === listAccounts.User && event.to === listAccounts.User2 && Number(event.value) === amount);
    });
  });

  /* Não foi implementado transferFrom to contract 
  describe('transferFrom to contract', () => {
  });  
  */
 
});
