pragma solidity 0.5.11;

import "./CeoCfoRole.sol";

/**
 * @title Manager maxcap feature
 * @dev Manager are responsible for MaxCap Token.
 */
contract MaxCapRole is CeoCfoRole {
    using Roles for Roles.Role;

    Roles.Role private _managers;

    event MaxCapManagerAdded(address indexed account);
    event MaxCapManagerRemoved(address indexed account);

    constructor () internal {
        _addMaxCapManager(msg.sender);
    }

    modifier onlyMaxCapManager() {
        require(isMaxCapManager(msg.sender), "MaxCapRole: onlyMaxCapManager");
        _;
    }

    function isMaxCapManager(address account) public view returns (bool) {
        return _managers.has(account);
    }

    function addMaxCapManager(address account) public onlyCEO {
        _addMaxCapManager(account);
    }

    function removeMaxCapManager(address account) public onlyCEO {
        _removeMaxCapManager(account);
    }

    function renounceMaxCapManager() public {
        _removeMaxCapManager(msg.sender);
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
