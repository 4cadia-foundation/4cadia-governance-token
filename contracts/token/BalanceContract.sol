pragma solidity ^0.5.1;

import "./IERC223Recipient.sol";

contract BalanceContract is IERC223Recipient {

    address public from;
    uint public value;
    bytes public data;

    function tokenFallback(address _from, uint _value, bytes memory _data) public {
        from = _from;
        value = _value;
        data = _data;
    }
}