const FGToken = artifacts.require('FGToken');
const truffleAssertions = require('truffle-assertions');
const { should } = require('./helpers');

contract('FGToken', accounts => {

    let accountOwner;
    let accountSub;
    let receiverAccount;

    beforeEach(async () => {
        accountOwner = accounts[0];
        accountSub = accounts[1];
        receiverAccount = accounts[3];

        this.token = await FGToken.new('FGToken', 'FGT', 8, 1000);
    });

    describe ('allowance',  () => {

        beforeEach( async () => {
            await this.token.transfer(accountSub, 500);
            await this.token.approve(accountSub , 200, {from: accountOwner });        
        });

        it ('should execute method allowance with success', async () => {
            await truffleAssertions.passes(this.token.allowance( accountOwner, accountSub ));
        });

        it ('should return balance approved for account', async () => {
            assert.equal(Number(await this.token.allowance( accountOwner , accountSub )), 200);
        });

        it('should add new balance', async () => {
            const value = 100;
            let beforeIncreaseAllowance;
            let afterIncreaseAllowance;
            
            beforeIncreaseAllowance = await this.token.allowance(accountOwner, accountSub);
            await this.token.increaseAllowance(accountSub, value, { from: accountOwner });
            afterIncreaseAllowance = await this.token.allowance(accountOwner, accountSub);
            assert.equal(afterIncreaseAllowance.toNumber(), (beforeIncreaseAllowance.toNumber() + value));
        });

        it('should decrease allowance', async () => {
            const value = 100;
    
            let beforeDecreaseAllowance;
            let afterDecreaseAllowance;
            
            beforeDecreaseAllowance = await this.token.allowance(accountOwner, accountSub);
           
            await this.token.decreaseAllowance(accountSub, value, { from: accountOwner });
            
            afterDecreaseAllowance = await this.token.allowance(accountOwner, accountSub);
            assert.equal(afterDecreaseAllowance.toNumber(), (beforeDecreaseAllowance.toNumber() - value));
        });

    });
    
    describe('approve', () => {
 
        it ('should execite a function approve', async () => {
            await truffleAssertions.passes(this.token.approve(accounts[1], 200, {from: accounts[0]}))
        });

        it('should approve balance of account owner for accountSub', async () => {
            await this.token.approve(accountSub, 200, {from: accountOwner});
            assert.equal(Number(await this.token.allowance(accountOwner,accountSub)), 200);
        });

        it('should emit Approval event after approve', async () => {
            const approval = await this.token.approve(accountSub, 200, {from: accountOwner});
            truffleAssertions.eventEmitted(approval, 'Approval', ev =>  ev.owner == accountOwner && ev.spender == accountSub && Number(ev.value) == 200);
        });
    });

    describe('transferFrom', () => {

        it('should transfer from other account after approve', async () => {
            await this.token.approve(accountSub, 200, {from: accountOwner});
            await truffleAssertions.passes (this.token.transferFrom(accountOwner, receiverAccount, 200, { from: accountSub }));
        });

        it('should return insuficient funds', async () => {
            await this.token.approve(accountSub, 200, {from: accountOwner});
            await this.token.transfer(accounts[4], 1000, {from: accountOwner});

            await truffleAssertions.fails( this.token.transferFrom(accountOwner, receiverAccount, 200, { from: accountSub }));
        });
    });
});
