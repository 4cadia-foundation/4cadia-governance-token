pragma solidity ^0.5.1;

import "../../vendors/oraclize-api/contracts/oraclize.sol";

contract Oracle is usingProvable {

    string private _priceEth;
    uint256 private _datetimePrice;

    event LogNewProvableQuery(string description);
    event LogNewPriceTicker(string price);

    constructor() public { }

    function __callback(
        bytes32 _myid,
        string memory _result
    )
        public
    {
        require(msg.sender == provable_cbAddress());
        _priceEth = _result;
        _datetimePrice = now;
        emit LogNewPriceTicker(_priceEth);
    }

    function getETHValue()
        public
        payable
    {
        if (provable_getPrice("URL") > address(this).balance) {
            emit LogNewProvableQuery("Provable query was NOT sent, please add some ETH to cover for the query fee.");
        } else {
            emit LogNewProvableQuery("Provable query was sent, waiting for the result...");
            provable_query(20, "URL", "json(https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD).RAW.ETH.USD.HIGHHOUR");
        }
    }

    function priceEth() public view returns(uint256) {
        return parseInt(_priceEth, 2);
    }

    function datetimePrice() public view returns (uint256){
        return _datetimePrice;
    }
}