pragma solidity 0.5.11;

import "@openzeppelin/contracts/access/Roles.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

/**
 * @title Chief executive officer and Chief financial officer
 * @dev CEO are responsible for administrate roles, add Pausable and alter MaxCap.
 * @dev CFO are responsible for Mint and Burn Token.
 */
contract CeoCfoRole {
    using Roles for Roles.Role;
    using SafeMath for uint256;

    Roles.Role private _CEOs;
    Roles.Role private _CFOs;
    uint256 private _totalCEOMembers;

    event CEOAdded(address indexed account);
    event CEORemoved(address indexed account);
    event CFOAdded(address indexed account);
    event CFORemoved(address indexed account);

    constructor () internal {
        _addCEO(msg.sender);
    }

    modifier onlyCEO() {
        require(isCEO(msg.sender), "CEORole: onlyCEO");
        _;
    }

    modifier onlyCFO() {
        require(isCFO(msg.sender), "CFORole: onlyCFO");
        _;
    }

    function isCEO(address account) public view returns (bool) {
        return _CEOs.has(account);
    }

    function isCFO(address account) public view returns (bool) {
        return _CFOs.has(account);
    }

    function totalCEOMembers() public view returns (uint256) {
        return _totalCEOMembers;
    }

    function addCEO(address account) public onlyCEO {
        require(!isCFO(account), 'CFO cannot be CEO');
        _addCEO(account);
    }

    function addCFO(address account) public onlyCEO {
        require(!isCEO(account), 'CEO cannot be CFO');
        _addCFO(account);
    }

    function removeCEO(address account) public onlyCEO {
        _removeCEO(account);
    }

    function removeCFO(address account) public onlyCEO {
        _removeCFO(account);
    }

    function renounceCEO() public {
        _removeCEO(msg.sender);
    }

    function renounceCFO() public {
        _removeCFO(msg.sender);
    }

    function _addCEO(address account) internal {
        _CEOs.add(account);
        _totalCEOMembers = _totalCEOMembers.add(1);
        emit CEOAdded(account);
    }

    function _addCFO(address account) internal {
        _CFOs.add(account);
        emit CFOAdded(account);
    }

    function _removeCEO(address account) internal {
        require(_totalCEOMembers > 1, 'CEORole: there must have at least one CEO');
        _CEOs.remove(account);
        _totalCEOMembers = _totalCEOMembers.sub(1);
        emit CEORemoved(account);
    }

    function _removeCFO(address account) internal {
        _CFOs.remove(account);
        emit CFORemoved(account);
    }
}
