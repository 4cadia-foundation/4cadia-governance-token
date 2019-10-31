const helpers = require('./helpers');
const CrowdsaleContract = artifacts.require('Crowdsale');
const truffleAssertions = require('truffle-assertions');
const BigNumber = web3.BigNumber;

contract('FGToken', accounts => {

    let listAccounts;
    let contract;
    let token;
    let rate;

    beforeEach('beforeEach: Crowdsale', async () => {
        rate = 1;
        listAccounts = helpers.parseAccounts(accounts);
        token = await helpers.instanceContract(accounts);
        await token.increaseForecast(1000, { from: listAccounts.CFO });
        await token.mint(listAccounts.CFO, 1000, { from: listAccounts.CFO });
        contract = await CrowdsaleContract.new(rate, listAccounts.CFO, token.address);
    });

    describe('Crowdsale', () => {
  
        it('should return token address', async () => {
            const address = await contract.token();
            assert.equal(address, token.address);
        });

        it('should return wallet where funds are collected', async () => {
            const wallet = await contract.wallet();
            assert.equal(wallet, listAccounts.CFO);
        });

        // it('must be buy tokens', async () => {
        //   await truffleAssertions.passes(contract.buyTokens(listAccounts.ALPHA, { from: listAccounts.ALPHA, value: 1 }));
        // });

    });
});