pragma solidity ^0.5.1;

import "../../vendors/oraclize-api/contracts/oraclize.sol";

contract Oracle is usingProvable {
    
    string public _priceEth;

    event LogNewProvableQuery(string description);
    event LogNewPriceTicker(string price);

    constructor()
        public
    {
        getETHValue();
    }

    function getETHValue() 
        public
        payable
    {
        if (provable_getPrice("URL") > address(this).balance) {
            emit LogNewProvableQuery("Provable query was NOT sent, please add some ETH to cover for the query fee.");
        } else {
            emit LogNewProvableQuery("Provable query was sent, waiting for the result...");
            provable_query(60, "URL", "json(https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD).RAW.ETH.USD.HIGHHOUR");
        }
    }

}