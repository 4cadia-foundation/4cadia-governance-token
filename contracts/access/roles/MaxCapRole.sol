pragma solidity ^0.5.1;

import "../../utils/Context.sol";
import "../Roles.sol";
import "./CEORole.sol";

/**
 * @title Manager maxcap feature
 * @dev Manager are responsible for MaxCap Token.
 */
contract MaxCapRole is Context, CEORole {
    using Roles for Roles.Role;

    event MaxCapManagerAdded(address indexed account);
    event MaxCapManagerRemoved(address indexed account);

    Roles.Role private _managers;

    constructor () internal {
        _addMaxCapManager(_msgSender());
    }

    modifier onlyMaxCapManager() {
        require(isMaxCapManager(_msgSender()), "MaxCapManager: caller does not have the MaxCap role");
        _;
    }

    function isMaxCapManager(address account) public view returns (bool) {
        return _managers.has(account);
    }

    function addMaxCapManager(address account) public onlyCEO {
        _addMaxCapManager(account);
    }

    function renounceMaxCapManager() public {
        _removeMaxCapManager(_msgSender());
    }

    function _addMaxCapManager(address account) internal {
        _managers.add(account);
        emit MaxCapManagerAdded(account);
    }

    function _removeMaxCapManager(address account) internal {
        _managers.remove(account);
        emit MaxCapManagerRemoved(account);
    }
}
