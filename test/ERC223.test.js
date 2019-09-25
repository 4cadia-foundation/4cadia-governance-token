const FGToken = artifacts.require('FGToken');
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

    describe ('transfer', () => {
        
        it("should be return true for transfer without _data param", async () => {
            const _to = accounts[1];
            const _value = 500;
            await truffleAssertions.passes(this.token.transfer(_to, _value));            
        });

        it("should be transfer value of address owner for other account", async () => {
            const _to = accounts[1];
            const _value = 500;
            const transfer = await this.token.transfer(_to, _value);
            const balance = await this.token.balanceOf(_to);
            assert.equal(balance.toNumber(), _value, 'accounts[1] balance is wrong')       
        });

        it("should be return true for transfer with _data param", async () => {
            const _to = accounts[1];
            const _value = 500;
            const _data = new Uint8Array([83,97,109,112,108,101,32,68,97,116,97]);
            await truffleAssertions.passes(this.token.transfer(_to, _value, _data));            
        });

    });


});