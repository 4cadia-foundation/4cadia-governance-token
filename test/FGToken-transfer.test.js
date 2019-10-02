const FGToken = artifacts.require('FGToken');
const BalanceContract = artifacts.require('BalanceContract');
const { should } = require('./helpers');
const truffleAssertions = require('truffle-assertions');

contract('FGToken', accounts => {
  const _name = 'FGToken';
  const _symbol = 'FGT';
  const _decimals = 8;
  const _initialSupply = 1000;

  beforeEach(async () => {
    this.token = await FGToken.new(_name, _symbol, _decimals, _initialSupply);
  });

  it('should validate balance initial supply', async () => {
    const balanceOwner = await this.token.balanceOf(accounts[0]);
    assert.equal(balanceOwner.toNumber(), _initialSupply, 'accounts[0] balance is wrong');
  });

  describe('transfer', () => {
    it('should return true for transfer without _data param', async () => {
      const _to = accounts[1];
      const _value = 500;
      await truffleAssertions.passes(this.token.transfer(_to, _value));
    });

    it('should return fail for method transfer when token is paused', async () => {
      await this.token.pause();
      await truffleAssertions.fails(this.token.transfer(accounts[1], 500), 'Pausable: paused');
    });

    it('should return fail for method transfer with param _data when token is paused', async () => {
      await this.token.pause();
      await truffleAssertions.fails(this.token.transfer(accounts[1], 500, new Uint8Array([83, 97, 109, 112, 108, 101, 32, 68, 97, 116, 97])), 'Pausable: paused');
    });

    it('should make transfer between accounts[1] and accounts[2], with success', async () => {
      await this.token.transfer(accounts[1], 500);
      await this.token.transfer(accounts[2], 200, { from: accounts[1] });

      const balanceOwner = await this.token.balanceOf(accounts[0]);
      const balanceA = await this.token.balanceOf(accounts[1]);
      const balanceB = await this.token.balanceOf(accounts[2]);

      assert.equal(balanceA.toNumber(), 300, 'accounts[1] balance is wrong');
      assert.equal(balanceB.toNumber(), 200, 'accounts[2] balance is wrong');
      assert.equal(balanceOwner.toNumber(), 500, 'accounts[0] balance is wrong');
    });

    it('should transfer value of address owner for other account', async () => {
      const _to = accounts[1];
      const _value = 500;
      await this.token.transfer(_to, _value);
      const balance = await this.token.balanceOf(_to);
      assert.equal(balance.toNumber(), _value, 'accounts[1] balance is wrong');
    });

    it('should return true for transfer with _data param', async () => {
      const _to = accounts[1];
      const _value = 500;
      const _data = new Uint8Array([83, 97, 109, 112, 108, 101, 32, 68, 97, 116, 97]);
      await truffleAssertions.passes(this.token.transfer(_to, _value, _data));
    });

    it('should transfer value of address owner for other account with _data param', async () => {
      const _to = accounts[1];
      const _value = 500;
      const _data = new Uint8Array([83, 97, 109, 112, 108, 101, 32, 68, 97, 116, 97]);
      await this.token.transfer(_to, _value, _data);
      const balance = await this.token.balanceOf(_to);
      assert.equal(balance.toNumber(), _value, 'accounts[1] balance is wrong');
    });

    it('should substract amount the balances owner', async () => {
      const amount = 900;
      const initialBalance = await this.token.balanceOf(accounts[0]);
      await this.token.transfer(accounts[1], amount);
      const resultBalance = await this.token.balanceOf(accounts[0]);
      assert.equal(resultBalance.toNumber(), (initialBalance - amount), 'accounts[0] balance is wrong');
    });

    it('transfer should emit event Transfer', async () => {
      const _data = new Uint8Array([83, 97, 109, 112, 108, 101, 32, 68, 97, 116, 97]);
      const _account = accounts[0];
      const _value = 500;
      const tx = await this.token.transfer(accounts[1], _value, _data);
      truffleAssertions.eventEmitted(tx, 'Transfer',
        ev => ev.from === _account && ev.to === accounts[1] && ev.value.toNumber() === _value,
        'Transfer should be emitted with correct parameters');
    });

    it('transfer of the ERC223 tokens to a balance contract implementing the ERC223 fallback should succeed', async () => {
      const balanceContract = await BalanceContract.new();
      const _data = new Uint8Array([83, 97, 109, 112, 108, 101, 32, 68, 97, 116, 97]);
      const _value = 100;
      await this.token.transfer(balanceContract.address, _value, _data);
      expect(await balanceContract.from()).to.equal(accounts[0]);
      expect(Number(await balanceContract.value())).to.equal(_value);
    });

    it('should revert operation, insuficient funds for transfer without _data param', async () => {
      const _to = accounts[1];
      const balance = await this.token.balanceOf(accounts[0]);
      const _value = _initialSupply + 500;
      await truffleAssertions.reverts(this.token.transfer(_to, _value), 'Insuficient funds');
      expect(balance.toNumber()).to.equal(_initialSupply);
    });

    it('should revert operation, insuficient funds for transfer with _data param', async () => {
      const _to = accounts[1];
      const _data = new Uint8Array([83, 97, 109, 112, 108, 101, 32, 68, 97, 116, 97]);
      const balance = await this.token.balanceOf(accounts[0]);
      const _value = _initialSupply + 500;
      await truffleAssertions.reverts(this.token.transfer(_to, _value, _data), 'Insuficient funds');
      expect(balance.toNumber()).to.equal(_initialSupply);
    });
  });
});
