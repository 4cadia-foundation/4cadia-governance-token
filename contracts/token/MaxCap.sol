pragma solidity ^0.5.1;

import '../math/SafeMath.sol';
import "./Pausable.sol";
import "../access/roles/MaxCapRole.sol";

contract MaxCap is MaxCapRole, Pausable {

    using SafeMath for uint;

    uint256 public maxCap_;

    event MaxCapChange (uint256 oldValue, uint256 newValue);

    function maxCap () public view returns (uint256) {
        return maxCap_;
    }

    function increaseMaxCap (uint256 _value) public whenNotPaused onlyMaxCapManager returns(bool success) {
       require(_value != 0, 'value not zero');
       uint256 oldValue = maxCap_;
       maxCap_ = maxCap_.add(_value);
       emit MaxCapChange(oldValue, maxCap_);
       return true;
    }

    function decreaseMaxCap (uint256 _value) public whenNotPaused onlyMaxCapManager returns(bool success) {
        require(_value != 0, 'value not zero');
        require(_value <= maxCap_, 'value cannot be greater than maxCap');
        uint256 oldValue = maxCap_;
        maxCap_ = maxCap_.sub(_value);
        emit MaxCapChange(oldValue, maxCap_);
        return true;
    }
}