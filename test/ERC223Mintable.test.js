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

    describe ('Mintable', () => {

        
        it("mint transaction exists", async () => {
            const account = accounts[1];
            const amount = 500;
            await truffleAssertions.passes(this.token.mint(account, amount));
        });

        it("should be return true if account is Minter", async () => {
            const account = accounts[1];
            let isMinter = await this.token.isMinter(account)
            console.log ('      address: ' + account)
            assert.equal(isMinter, true, 'this address is not Minter')
        });
    });
});