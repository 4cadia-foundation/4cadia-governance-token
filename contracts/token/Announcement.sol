import "../access/roles/CFORole.sol";
import "./Pausable.sol";
import "../math/SafeMath.sol";

/**
 * @title Announcement
 * @dev forecast announcement.
 */
contract Announcement is CFORole, Pausable {
    using SafeMath for uint;

    uint256 public forecast_;
   
    event ForecastChange(uint256 oldValue, uint256 newValue);

    constructor () internal {
        forecast_ = 0;
    }

  /**
  * @dev value forecast
  */
    function forecast() public view returns (uint256) {
        return forecast_;
    }

  /**
  * @dev increment forecast value
  * @param _value The amount to be increment.
  */
    function increaseForecast(uint256 _value) public whenNotPaused onlyCFO returns ( bool success ) {
        require(_value != 0, 'value cannot be zero');
        uint256 oldValue = forecast_;
        forecast_ = forecast_.add(_value);
        emit ForecastChange(oldValue, forecast_);
        return true;
    }

    /**
  * @dev decrement forecast value
  * @param _value The amount to be decremented.
  */
    function decreaseForecast(uint256 _value) public whenNotPaused onlyCFO returns ( bool success )  {
        require(_value != 0, 'value cannot be zero');
        uint256 oldValue = forecast_;
        forecast_ = forecast_.sub(_value);
        emit ForecastChange(oldValue, forecast_);
        return true;
    }
}