const FGToken = artifacts.require('FGToken');
const BalanceContract = artifacts.require('BalanceContract');
const truffleAssertions = require('truffle-assertions');

contract('FGToken', accounts => {

  const _initialSupply = 1000;
  const accountOwner = accounts[0];
  const accountCEO = accounts[1];
  const accountCFO = accounts[2];
  const accountAlpha = accounts[3];
  const accountBetha = accounts[3];
  const data = new Uint8Array([83, 97, 109, 112, 108, 101, 32, 68, 97, 116, 97]);

  describe('transfer', () => {

    beforeEach('beforeEach: transfer', async () => {

      this.token = await FGToken.new('FGToken', 'FGT', 8, _initialSupply, { from: accountOwner });

      await this.token.addCEO(accountCEO, { from: accountOwner });
      await this.token.addCFO(accountCFO, { from: accountCEO });

      await this.token.increaseForecast(_initialSupply, { from: accountCFO });
      await this.token.mint(accountCFO, _initialSupply, { from: accountCFO });
    });
    
    it('should pass transfer', async () => {
      await truffleAssertions.passes(this.token.transfer(accountAlpha, 500, data, { from: accountCFO }));
    });

    it('should fail for method transfer when token is paused', async () => {
      await this.token.pause({ from: accountCEO });
      await truffleAssertions.fails(this.token.transfer(accountAlpha, 500, data, { from: accountCFO }), 'Pausable: paused');
    });

    it('should transfer value of address owner for other account', async () => {
      await truffleAssertions.passes(this.token.transfer(accountAlpha, 500, data, { from: accountCFO }));
      await truffleAssertions.passes(this.token.transfer(accountBetha, 500, data, { from: accountAlpha }));
    });

    it('should substract amount the balances of account', async () => {
      const initialBalance = await this.token.balanceOf(accountCFO);
      await this.token.transfer(accountAlpha, 500, data, { from: accountCFO });
      const resultBalance = await this.token.balanceOf(accountAlpha);
      assert.equal(resultBalance.toNumber(), (initialBalance - 500), 'accounts[0] balance is wrong');
    });

    it('transfer should emit event Transfer', async () => {
      const tx = await this.token.transfer(accountAlpha, 500, data, { from: accountCFO });
      truffleAssertions.eventEmitted(tx, 'Transfer',
        ev => ev.from === accountCFO && ev.to === accountAlpha && ev.value.toNumber() === 500,
        'Transfer should be emitted with correct parameters');
    });

    it('transfer of the ERC223 tokens to a balance contract implementing the ERC223 fallback should succeed', async () => {
      const balanceContract = await BalanceContract.new({ from: accountAlpha });
      await this.token.transfer(balanceContract.address, 100, data, { from: accountCFO });
      expect(Number(await balanceContract.value())).to.equal(100);
    });

    it('should revert operation, insuficient funds for transfer', async () => {
      const _value = _initialSupply + 500;
      await truffleAssertions.reverts(this.token.transfer(accountAlpha, _value, data, { from: accountCFO }), 'insuficient funds');
    });

  });
});
