pragma solidity ^0.5.1;

import "../../utils/Context.sol";
import "../Roles.sol";
import "./CEORole.sol";

/**
 * @title Chief financial officer
 * @dev CFO are responsible for Mint and Burn Token.
 */
contract CFORole is Context, CEORole {
    using Roles for Roles.Role;

    event CFOAdded(address indexed account);
    event CFORemoved(address indexed account);

    Roles.Role private CFOs;

    modifier onlyCFO() {
        require(isCFO(_msgSender()), "CFORole: caller does not have the CFO role");
        _;
    }

    function isCFO(address account) public view returns (bool) {
        return CFOs.has(account);
    }

    function addCFO(address account) public onlyCEO {
        require(!isCEO(account), 'CEO cant be CFO');
        _addCFO(account);
    }

    function renounceCFO() public {
        _removeCFO(_msgSender());
    }

    function _addCFO(address account) internal {
        CFOs.add(account);
        emit CFOAdded(account);
    }

    function _removeCFO(address account) internal {
        CFOs.remove(account);
        emit CFORemoved(account);
    }
}
