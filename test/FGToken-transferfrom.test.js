const FGToken = artifacts.require('FGToken');
const truffleAssertions = require('truffle-assertions');
const { should } = require('./helpers');

contract('FGToken', accounts => {


    beforeEach(async () => {
        this.token = await FGToken.new('FGToken', 'FGT', 8, 1000);
    });

    describe ('allowance',  () => {
        beforeEach( async () => {
            await this.token.transfer(accounts[1], 500);
            await this.token.approve(accounts[1], 200, {from: accounts[0]});
        });

        it ('deve executar a funçã odo allowance', async () => {
            await truffleAssertions.passes(this.token.allowance(accounts[0], accounts[1]));
        });

        it ('deve retornar o saldo aprovado para a conta 2', async () => {
            assert.equal(Number(await this.token.allowance(accounts[0], accounts[1])), 200);
        });
    });
    
    describe('approve', () => {
 
        it ('deve executar a função do approve', async () => {
            await truffleAssertions.passes(this.token.approve(accounts[1], 200, {from: accounts[0]}))
        });

        it('should approve balance of account owner for subaccount', async () => {
            const accountOwner = accounts[0];
            const subAccount = accounts[1];
            await this.token.approve(subAccount, 200, {from: accountOwner});
            assert.equal(Number(await this.token.allowance(accountOwner,subAccount)), 200);
        });

        it('should emit Approval event after approve', async () => {
            const subAccount = accounts[1];
            const accountOwner = accounts[0];
            const approval = await this.token.approve(subAccount, 200, {from: accountOwner});
            truffleAssertions.eventEmitted(approval, 'Approval', ev =>  ev.owner == accountOwner && ev.spender == subAccount && Number(ev.value) == 200);
        });
    });

    describe('transferFrom', () => {

        it('should transfer from other account after approve', async () => {

            const subAccount = accounts[1];
            const ownerAccount = accounts[0];
            const receiverAccount = accounts[3];

            await this.token.approve(subAccount, 200, {from: ownerAccount});
            await truffleAssertions.passes (this.token.transferFrom(ownerAccount, receiverAccount, 200, { from: subAccount }));
        });

        it('should return insuficient funds', async () => {
            
            const subAccount = accounts[1];
            const ownerAccount = accounts[0];
            const receiverAccount = accounts[3];

            await this.token.approve(subAccount, 200, {from: ownerAccount});
            await this.token.transfer(accounts[4], 1000, {from: ownerAccount});
            await truffleAssertions.fails( this.token.transferFrom(ownerAccount, receiverAccount, 200, { from: subAccount }));
        });

    });





})
