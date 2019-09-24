const FGToken = artifacts.require('FGToken');
const { should } = require('./helpers');
const truffleAssertions = require('truffle-assertions');

contract('FGToken', acounts => {
  
    beforeEach(async () => {
        this.token = await FGToken.new(_name, _symbol, _decimals);
    });


});