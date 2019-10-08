pragma solidity ^0.5.1;

import "../../utils/Context.sol";
import "../Roles.sol";

/**
 * @title Chief executive officer
 * @dev CEO are responsible for administrate roles, add Pausable and alter MaxCap.
 */
contract CEORole is Context {
    using Roles for Roles.Role;

    event CEOAdded(address indexed account);
    event CEORemoved(address indexed account);

    Roles.Role private CEOs;

    constructor () internal {
        _addCEO(_msgSender());
    }

    modifier onlyCEO() {
        require(isCEO(_msgSender()), "CEORole: caller does not have the CEO role");
        _;
    }

    function isCEO(address account) public view returns (bool) {
        return CEOs.has(account);
    }

    function addCEO(address account) public onlyCEO {
        _addCEO(account);
    }

    function renounceCEO() public {
        _removeCEO(_msgSender());
    }

    function _addCEO(address account) internal {
        CEOs.add(account);
        emit CEOAdded(account);
    }

    function _removeCEO(address account) internal {
        CEOs.remove(account);
        emit CEORemoved(account);
    }
}
