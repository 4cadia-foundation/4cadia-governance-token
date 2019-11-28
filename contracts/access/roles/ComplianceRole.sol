pragma solidity ^0.5.1;

import "@openzeppelin/contracts/access/Roles.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./CeoCfoRole.sol";

/**
 * @title ComplianceRole
 * @dev Compliance are responsible for assigning and removing accounts from whitelist.
 */
contract ComplianceRole is  CeoCfoRole {
    using Roles for Roles.Role;
    using SafeMath for uint256;

    Roles.Role private _compliances;
    uint256 private _totalComplianceMembers;

    event ComplianceAdded(address indexed account);
    event ComplianceRemoved(address indexed account);

    constructor () internal {
    }

    modifier onlyCompliance() {
        require(isCompliance(msg.sender), "ComplianceRole: onlyCompliance");
        _;
    }

    function isCompliance(address account) public view returns (bool) {
        return _compliances.has(account);
    }

    function totalComplianceMembers() public view returns (uint256) {
        return _totalComplianceMembers;
    }

    function addCompliance(address account) public onlyCEO {
        _addCompliance(account);
    }

    function removeCompliance(address account) public onlyCEO {
        _removeCompliance(account);
    }

    function renounceCompliance() public {
        _removeCompliance(msg.sender);
    }

    function _addCompliance(address account) internal {
        _compliances.add(account);
        _totalComplianceMembers = _totalComplianceMembers.add(1);
        emit ComplianceAdded(account);
    }

    function _removeCompliance(address account) internal {
        require(_totalComplianceMembers > 1, 'ComplianceRole: there must have at least one compliance member');
        _compliances.remove(account);
        _totalComplianceMembers = _totalComplianceMembers.sub(1);
        emit ComplianceRemoved(account);
    }
}