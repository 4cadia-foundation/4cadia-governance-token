pragma solidity ^0.5.0;

import "./ERC223Detailed.sol";
import "./ERC223.sol";
import "./ERC223Mintable.sol";

contract FGToken is ERC223Mintable ,ERC223Detailed {

    constructor (string memory _name, string memory _symbol, uint8 _decimals, uint256 initialSupply) 
    ERC223Detailed(_name,_symbol,_decimals) public {
        mint(msg.sender, initialSupply);
    }

    function mint(address account, uint256 amount) public onlyMinter returns (bool) {
        require(account != address(0), "ERC20: mint to the zero address");
        _totalSupply = _totalSupply.add(amount);
        balances[account] = balances[account].add(amount);
        return true;
    }


}