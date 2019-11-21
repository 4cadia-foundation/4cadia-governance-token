pragma solidity 0.5.11;

import "./ComplianceRole.sol";

/**
 * @title WhitelistedRole
 * @dev Whitelisted accounts have been approved by a WhitelistAdmin to perform certain actions (e.g. participate in a
 * crowdsale). This role is special in that the only accounts that can add it are WhitelistAdmins (who can also remove
 * it), and not Whitelisteds themselves.
 */
contract WhitelistedRole is ComplianceRole {
    using Roles for Roles.Role;

    Roles.Role private _whitelisteds;

    event WhitelistedAdded(address indexed account);
    event WhitelistedRemoved(address indexed account);

    function isWhitelisted(address account) public view returns (bool) {
        return _whitelisteds.has(account);
    }

    function addWhitelist(address account) public onlyCompliance {
        _addWhitelisted(account);
    }

    function removeWhitelist(address account) public onlyCompliance {
        _removeWhitelist(account);
    }

    function renounceWhitelist() public {
        _removeWhitelist(msg.sender);
    }

    function _addWhitelisted(address account) internal {
        _whitelisteds.add(account);
        emit WhitelistedAdded(account);
    }

    function _removeWhitelist(address account) internal {
        _whitelisteds.remove(account);
        emit WhitelistedRemoved(account);
    }
}
