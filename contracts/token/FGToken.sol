pragma solidity 0.5.11;

import "./IERC223.sol";
import "./IERC223Recipient.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "../access/roles/CeoCfoRole.sol";
import "../access/roles/MaxCapRole.sol";
import "../access/roles/WhitelistedRole.sol";
import "./Pausable.sol";
import "../utils/Address.sol";

/**
 * @title Reference implementation of the ERC223 standard token.
 */
contract FGToken is IERC223, ERC20Detailed, CeoCfoRole, Pausable, MaxCapRole, ComplianceRole, WhitelistedRole {
    using SafeMath for uint256;

    mapping(address => uint256) private _balances;
    mapping (address => mapping (address => uint256)) private _allowances;
    uint256 private _totalSupply;
    uint256 private _maxCap;
    uint256 private _forecast;
    uint256 private _lastForecastDate;
    uint256 private _forecastWait;

    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Burn(address indexed from, uint256 value);
    event Mint(address indexed to, uint256 value);
    event ForecastChange(uint256 oldValue, uint256 newValue);
    event ForecastWait(uint256 oldForecastDuration, uint256 newForecastDuration);
    event MaxCapChange (uint256 oldValue, uint256 newValue);

    constructor (
        string memory _name, string memory _symbol, uint8 _decimals, uint256 _maxCapValue, uint256 _forecastDuration)
        ERC20Detailed(_name, _symbol, _decimals) public {
        increaseMaxCap(_maxCapValue);
        _forecast = 0;
        _totalSupply = 0;
        changeForecastWait(_forecastDuration);
        _lastForecastDate = now;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    /**
     * @dev Returns balance of the `_owner`.
     *
     * @param _owner   The address whose balance will be returned.
     * @return balance Balance of the `_owner`.
     */
    function balanceOf(address _owner) public view returns (uint256) {
        return _balances[_owner];
    }

    function forecast() public view returns (uint256) {
        return _forecast;
    }

    function maxCap () public view returns (uint256) {
        return _maxCap;
    }

    // Standard function transfer similar to ERC20 transfer with no _data
    // Added due to backwards compatibility reasons
    function transfer(address _to, uint _value) public whenNotPaused returns (bool) {
        bytes memory empty;
        _transfer(msg.sender, _to, _value, empty);
        return true;
    }

    // ERC223 Transfer to a contract or externally-owned account
    function transfer(address _to, uint _value, bytes memory _data) public whenNotPaused returns (bool) {
        _transfer(msg.sender, _to, _value, _data);
        return true;
    }

    function _transfer(address _from, address _to, uint _value, bytes memory _data) internal {
        require(_from != address(0), "ERC223: transfer from the zero address");
        require(_to != address(0), "ERC223: transfer to the zero address");
        require(_value <= _balances[_from], "insuficient funds");

        _balances[_from] = _balances[_from].sub(_value);
        _balances[_to] = _balances[_to].add(_value);

        if(Address.isContract(_to)) {
            IERC223Recipient receiver = IERC223Recipient(_to);
            receiver.tokenFallback(_from, _value, _data);
        }
        emit Transfer(_from, _to, _value, _data);
    }


    function allowance(address owner, address spender) public view returns (uint256) {
        return _allowances[owner][spender];
    }

    // WARNING! When changing the approval amount, first set it back to zero
    // AND wait until the transaction is mined. Only afterwards set the new
    // amount. Otherwise you may be prone to a race condition attack.
    // See: https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
    function approve(address spender, uint256 value) public whenNotPaused returns (bool) {
        _approve(msg.sender, spender, value);
        return true;
    }

    function _approve(address owner, address spender, uint256 value) internal {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = value;
        emit Approval(owner, spender, value);
    }

    function increaseAllowance(address spender, uint256 addedValue) public whenNotPaused returns (bool) {
        _approve(msg.sender, spender, _allowances[msg.sender][spender].add(addedValue));
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public whenNotPaused returns (bool) {
        _approve(msg.sender, spender, _allowances[msg.sender][spender].sub(subtractedValue));
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _amount) public whenNotPaused returns (bool) {
        bytes memory empty;
        _transfer(_from, _to, _amount, empty);
        _approve(_from, msg.sender, _allowances[_from][msg.sender].sub(_amount));
        return true;
    }

    /**
     * @dev See {ERC20-_mint}.
     *
     * Requirements:
     *
     * - the caller must have the {CFORole}.
     */
    function mint(address _account, uint256 _amount) public onlyCFO whenNotPaused {
        _mint(_account, _amount);
    }

    function _mint(address _account, uint256 _amount) internal {
        require(_account != address(0), "ERC20: mint to the zero address");
        require(_amount <= _forecast, "amount must be less than forecast value");

        _balances[_account] = _balances[_account].add(_amount);
        _totalSupply = _totalSupply.add(_amount);
        _forecast = _forecast.sub(_amount);

        emit Mint(_account, _amount);
        bytes memory empty;
        emit Transfer(address(0), _account, _amount, empty);
    }

    function burn(uint256 _amount) public onlyCFO whenNotPaused {
        _burn(msg.sender, _amount);
    }

    function _burn(address _from, uint256 _amount) internal  {
        require(_amount <= _balances[_from], "insuficient funds");

        _balances[_from] = _balances[_from].sub(_amount);
        _totalSupply = _totalSupply.sub(_amount);

        emit Burn(_from, _amount);
        bytes memory empty;
        emit Transfer(_from, address(0), _amount, empty);
    }


    function increaseMaxCap (uint256 _value) public whenNotPaused onlyMaxCapManager returns(bool) {
       uint256 oldValue = _maxCap;
       _maxCap = _maxCap.add(_value);
       emit MaxCapChange(oldValue, _maxCap);
       return true;
    }

    function decreaseMaxCap (uint256 _value) public whenNotPaused onlyMaxCapManager returns(bool) {
        require((_maxCap - _value) >= _totalSupply, 'FGToken: maxCap less than totalSupply');
        uint256 oldValue = _maxCap;
        _maxCap = _maxCap.sub(_value);
        emit MaxCapChange(oldValue, _maxCap);
        return true;
    }

    /**
    * @dev change forecast wait in days
    */
    function changeForecastWait(uint256 _duration) public onlyCEO {
        uint256 oldForecastDuration = _forecastWait;
        _forecastWait = _duration.mul(1 days);
        emit ForecastWait(oldForecastDuration, _duration);
    }

    /**
    * @dev update date of forecast with forecast duration
    */
    function _updateLastForecastDate() internal {
        _lastForecastDate = now.add(_forecastWait);
    }

    /**
    * @dev return last forecast date
    */
    function lastForecastDate() public view returns (uint256) {
        return _lastForecastDate;
    }

    /**
    * @dev return wait time to next forecast
    */
    function forecastWait() public view returns (uint256) {
        return _forecastWait;
    }

    /**
    * @dev increment forecast value
    * @param _value The amount to be increment.
    */
    function increaseForecast(uint256 _value) public whenNotPaused onlyCFO returns (bool) {
        require((forecast() + _value + totalSupply()) <= maxCap(), 'FGToken: forecast greater than maxCap');
        require(_lastForecastDate <= now, "FGToken: forecast before wait time");

        uint256 oldValue = _forecast;
        _forecast = _forecast.add(_value);
        _updateLastForecastDate();
        emit ForecastChange(oldValue, _forecast);
        return true;
    }

    /**
    * @dev decrement forecast value
    * @param _value The amount to be decremented.
    */
    function decreaseForecast(uint256 _value) public whenNotPaused onlyCFO returns (bool)  {
        uint256 oldValue = _forecast;
        _forecast = _forecast.sub(_value);
        emit ForecastChange(oldValue, _forecast);
        return true;
    }

}
