pragma solidity ^0.5.1;

import "./IERC223.sol";

import "./IERC223Recipient.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "../access/roles/CeoCfoRole.sol";
import "../access/roles/MaxCapRole.sol";
import "../access/roles/WhitelistedRole.sol";
import "./Pausable.sol";
import "../utils/Address.sol";

/**
 * @title Reference implementation of the ERC223 standard token.
 */
//contract FGToken is IERC223, FGTokenDetailed, CEORole, CFORole, MaxCapRole, Pausable, MaxCap, WhitelistedRole {
contract FGToken is IERC20, IERC223, ERC20Detailed, CeoCfoRole, MaxCapRole, Pausable, ComplianceRole, WhitelistedRole {
    using SafeMath for uint256;

    mapping(address => uint256) balances;
    mapping (address => mapping (address => uint256)) private _allowances;
    uint256 private _totalSupply;
    uint256 private _maxCap;
    uint256 private _forecast;

    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Burn(address indexed from, uint256 value);
    event Mint(address indexed to, uint256 value);
    event ForecastChange(uint256 oldValue, uint256 newValue);
    event MaxCapChange (uint256 oldValue, uint256 newValue);

    constructor (
        string memory _name, string memory _symbol,
        uint8 _decimals, uint256 _maxCapValue)
        ERC20Detailed(_name, _symbol, _decimals) public {
        _maxCap = _maxCapValue;
        _forecast = 0;
        _totalSupply = 0;
    }

    /**
     * @dev Returns balance of the `_owner`.
     *
     * @param _owner   The address whose balance will be returned.
     * @return balance Balance of the `_owner`.
     */
    function balanceOf(address _owner) public view returns (uint256) {
        return balances[_owner];
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function forecast() public view returns (uint256) {
        return _forecast;
    }

    function maxCap () public view returns (uint256) {
        return _maxCap;
    }

    // ERC223 Transfer to a contract or externally-owned account
    function transfer(address to, uint value, bytes memory data) public whenNotPaused returns (bool success) {
        if(isContract(to)) {
            return transferToContract(to, value, data);
        }
        else {
            return transferToAddress(to, value, data);
        }
    }

    // Standard function transfer similar to ERC20 transfer with no _data
    // Added due to backwards compatibility reasons
    function transfer(address to, uint value) public whenNotPaused returns (bool success) {
        //standard function transfer similar to ERC20 transfer with no _data
        //added due to backwards compatibility reasons
        bytes memory empty;
        if(isContract(to)) {
            return transferToContract(to, value, empty);
        }
        else {
            return transferToAddress(to, value, empty);
        }
    }

    // ERC223 fetch contract size (must be nonzero to be a contract)
    //assemble the given address bytecode. If bytecode exists then the _address is a contract
    function isContract(address _address) private view returns (bool) {
        // This method relies in extcodesize, which returns 0 for contracts in
        // construction, since the code is only stored at the end of the
        // constructor execution.
        uint256 length;
        assembly {
                //retrieve the size of the code on target address, this needs assembly
                length := extcodesize(_address)
        }
        return (length > 0);
    }

    //function that is called when transaction target is an address
    function transferToAddress(address to, uint value, bytes memory data) private returns (bool success) {
        require(to != address(0), "ERC223: transfer to the zero address");
        require(balanceOf(msg.sender) >= value, "insuficient funds");
        balances[msg.sender] = balances[msg.sender].sub(value);
        balances[to] = balances[to].add(value);
        emit Transfer(msg.sender, to, value, data);
        return true;
    }

    // ERC223 Transfer to contract and invoke tokenFallback() method
    //function that is called when transaction target is a contract
    function transferToContract(address to, uint value, bytes memory data) private returns (bool success) {
        require(to != address(0), "ERC223: transfer to the zero address");
        require(balanceOf(msg.sender) >= value, "insuficient funds");
        balances[msg.sender] = balances[msg.sender].sub(value);
        balances[to] = balances[to].add(value);

        IERC223Recipient receiver = IERC223Recipient(to);
        receiver.tokenFallback(msg.sender, value, data);
        emit Transfer(msg.sender, to, value, data);
        return true;
    }

    


    function _transfer(address sender, address to, uint value, bytes memory data) internal {
        require(sender != address(0), "ERC223: transfer from the zero address");
        require(to != address(0), "ERC223: transfer to the zero address");
        require(balances[sender] >= value, "insuficient funds");

        balances[sender] = balances[sender].sub(value);
        balances[to] = balances[to].add(value);

        if(isContract(to)) {
            IERC223Recipient receiver = IERC223Recipient(to);
            receiver.tokenFallback(sender, value, data);
        }
        emit Transfer(sender, to, value, data);
    }

    function transferFrom(address _sender, address _to, uint256 _amount) public whenNotPaused returns (bool) {
        bytes memory empty = "";
        _transfer(_sender, _to, _amount, empty);
        _approve(_sender, msg.sender, _allowances[_sender][msg.sender].sub(_amount));
        return true;
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

    /**
     * @dev See {ERC20-_mint}.
     *
     * Requirements:
     *
     * - the caller must have the {MinterRole}.
     */
    function mint(address _account, uint256 amount) public onlyCFO whenNotPaused {
        _mint(_account, amount);
    }

    function _mint(address _account, uint256 _amount) internal {
        require(_account != address(0), "ERC20: mint to the zero address");
        require(_amount <= _forecast, "amount must be less than forecast value");
  
        bytes memory empty = hex"00000000";

        balances[_account] = balances[_account].add(_amount);
        _totalSupply = _totalSupply.add(_amount);
        _forecast = _forecast.sub(_amount);

        emit Mint(_account, _amount);
        emit Transfer(address(0), _account, _amount, empty);
    }

    function burn(uint256 _amount) public onlyCFO whenNotPaused {
        _burn(msg.sender, _amount);
    }

    function _burn(address _who, uint256 _amount) internal  {
        require(_amount <= balances[_who], "insuficient funds");
        bytes memory empty = hex"00000000";

        balances[_who] = balances[_who].sub(_amount);
        _totalSupply = _totalSupply.sub(_amount);

        emit Burn(_who, _amount);
        emit Transfer(_who, address(0), _amount, empty);
    }

    function increaseMaxCap (uint256 value) public whenNotPaused onlyMaxCapManager returns(bool) {
       uint256 oldValue = _maxCap;
       _maxCap = _maxCap.add(value);
       emit MaxCapChange(oldValue, _maxCap);
       return true;
    }

    function decreaseMaxCap (uint256 value) public whenNotPaused onlyMaxCapManager returns(bool) {
        require((_maxCap - value) >= _totalSupply, 'FGToken: maxCap less than totalSupply');
        uint256 oldValue = _maxCap;
        _maxCap = _maxCap.sub(value);
        emit MaxCapChange(oldValue, _maxCap);
        return true;
    }

    /**
    * @dev increment forecast value
    * @param value The amount to be increment.
    */
    function increaseForecast(uint256 value) public whenNotPaused onlyCFO returns (bool) {
        uint256 total = forecast() + value + _totalSupply;
        require(total <= maxCap(), 'FGToken: forecast greater than maxCap');
        uint256 oldValue = _forecast;
        _forecast = _forecast.add(value);
        emit ForecastChange(oldValue, _forecast);
        return true;
    }

    /**
    * @dev decrement forecast value
    * @param value The amount to be decremented.
    */
    function decreaseForecast(uint256 value) public whenNotPaused onlyCFO returns (bool)  {
        uint256 oldValue = _forecast;
        _forecast = _forecast.sub(value);
        emit ForecastChange(oldValue, _forecast);
        return true;
    }

}