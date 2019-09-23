pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

contract FGToken is ERC20, ERC20Detailed, Ownable {

    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint256 initialSupply) 
    ERC20Detailed(_name, _symbol, _decimals) public {
        _mint(msg.sender, initialSupply);
    }

}