
// File: contracts/token/IERC223.sol

pragma solidity ^0.5.1;

/**
 * @dev Interface of the ERC777Token standard as defined in the EIP.
 *
 * This contract uses the
 * [ERC1820 registry standard](https://eips.ethereum.org/EIPS/eip-1820) to let
 * token holders and recipients react to token movements by using setting implementers
 * for the associated interfaces in said registry. See `IERC1820Registry` and
 * `ERC1820Implementer`.
 */

contract IERC223 {
    /**
     * @dev Returns the total supply of the token.
     */
    uint public _totalSupply;
    
    /**
     * @dev Returns the balance of the `who` address.
     */
    function balanceOf(address who) public view returns (uint);
        
    /**
     * @dev Transfers `value` tokens from `msg.sender` to `to` address
     * and returns `true` on success.
     */
    function transfer(address to, uint value) public returns (bool success);
        
    /**
     * @dev Transfers `value` tokens from `msg.sender` to `to` address with `data` parameter
     * and returns `true` on success.
     */
    function transfer(address to, uint value, bytes memory data) public returns (bool success);
     
     /**
     * @dev Event that is fired on successful transfer.
     */
    event Transfer(address indexed from, address indexed to, uint value, bytes data);
}

// File: contracts/token/IERC223Recipient.sol

pragma solidity ^0.5.1;

 /**
 * @title Contract that will work with ERC223 tokens.
 */
 
contract IERC223Recipient { 
/**
 * @dev Standard ERC223 function that will handle incoming token transfers.
 *
 * @param _from  Token sender address.
 * @param _value Amount of tokens.
 * @param _data  Transaction metadata.
 */
    function tokenFallback(address _from, uint _value, bytes memory _data) public;
}

// File: contracts/token/FGTokenDetailed.sol

pragma solidity ^0.5.1;


/**
 * @dev Optional functions from the ERC223 standard.
 */
contract FGTokenDetailed is IERC223 {
    string private _name;
    string private _symbol;
    uint8 private _decimals;

    /**
     * @dev Sets the values for `name`, `symbol`, and `decimals`. All three of
     * these values are immutable: they can only be set once during
     * construction.
     */
    constructor (string memory name, string memory symbol, uint8 decimals) public {
        _name = name;
        _symbol = symbol;
        _decimals = decimals;
    }

    /**
     * @dev Returns the name of the token.
     */
    function name() public view returns (string memory) {
        return _name;
    }

    /**
     * @dev Returns the symbol of the token, usually a shorter version of the
     * name.
     */
    function symbol() public view returns (string memory) {
        return _symbol;
    }

    /**
     * @dev Returns the number of decimals used to get its user representation.
     * For example, if `decimals` equals `2`, a balance of `505` tokens should
     * be displayed to a user as `5,05` (`505 / 10 ** 2`).
     *
     * Tokens usually opt for a value of 18, imitating the relationship between
     * Ether and Wei.
     *
     * > Note that this information is only used for _display_ purposes: it in
     * no way affects any of the arithmetic of the contract, including
     * `IERC20.balanceOf` and `IERC20.transfer`.
     */
    function decimals() public view returns (uint8) {
        return _decimals;
    }
}

// File: contracts/math/SafeMath.sol

pragma solidity ^0.5.0;

/**
 * @dev Wrappers over Solidity's arithmetic operations with added overflow
 * checks.
 *
 * Arithmetic operations in Solidity wrap on overflow. This can easily result
 * in bugs, because programmers usually assume that an overflow raises an
 * error, which is the standard behavior in high level programming languages.
 * `SafeMath` restores this intuition by reverting the transaction when an
 * operation overflows.
 *
 * Using this library instead of the unchecked operations eliminates an entire
 * class of bugs, so it's recommended to use it always.
 */
library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "SafeMath: subtraction overflow");
        uint256 c = a - b;

        return c;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // Solidity only automatically asserts when dividing by 0
        require(b > 0, "SafeMath: division by zero");
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b != 0, "SafeMath: modulo by zero");
        return a % b;
    }
}

// File: contracts/utils/Address.sol

pragma solidity ^0.5.0;

/**
 * @dev Collection of functions related to the address type
 */
library Address {
    /**
     * @dev Returns true if `account` is a contract.
     *
     * This test is non-exhaustive, and there may be false-negatives: during the
     * execution of a contract's constructor, its address will be reported as
     * not containing a contract.
     *
     * > It is unsafe to assume that an address for which this function returns
     * false is an externally-owned account (EOA) and not a contract.
     */
    function isContract(address account) internal view returns (bool) {
        // This method relies in extcodesize, which returns 0 for contracts in
        // construction, since the code is only stored at the end of the
        // constructor execution.

        uint256 size;
        // solhint-disable-next-line no-inline-assembly
        assembly { size := extcodesize(account) }
        return size > 0;
    }

    /**
     * @dev Converts an `address` into `address payable`. Note that this is
     * simply a type cast: the actual underlying value is not changed.
     */
    function toPayable(address account) internal pure returns (address payable) {
        return address(uint160(account));
    }
}

// File: contracts/utils/Context.sol

pragma solidity ^0.5.0;

/*
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with GSN meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
contract Context {
    // Empty internal constructor, to prevent people from mistakenly deploying
    // an instance of this contract, which should be used via inheritance.
    constructor () internal {}
    // solhint-disable-previous-line no-empty-blocks

    function _msgSender() internal view returns (address payable) {
        return msg.sender;
    }

    function _msgData() internal view returns (bytes memory) {
        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
        return msg.data;
    }
}

// File: contracts/access/Roles.sol

pragma solidity ^0.5.1;

/**
 * @title Roles
 * @dev Library for managing addresses assigned to a Role.
 */
library Roles {
    struct Role {
        mapping (address => bool) bearer;
    }

    /**
     * @dev Give an account access to this role.
     */
    function add(Role storage role, address account) internal {
        require(!has(role, account), "Roles: account already has role");
        role.bearer[account] = true;
    }

    /**
     * @dev Remove an account's access to this role.
     */
    function remove(Role storage role, address account) internal {
        require(has(role, account), "Roles: account does not have role");
        role.bearer[account] = false;
    }

    /**
     * @dev Check if an account has this role.
     * @return bool
     */
    function has(Role storage role, address account) internal view returns (bool) {
        require(account != address(0), "Roles: account is the zero address");
        return role.bearer[account];
    }
}

// File: contracts/access/roles/CEORole.sol

pragma solidity ^0.5.1;



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

// File: contracts/access/roles/CFORole.sol

pragma solidity ^0.5.1;




/**
 * @title Chief financial officer
 * @dev CFO are responsible for Mint and Burn Token.
 */
contract CFORole is Context, CEORole {
    using Roles for Roles.Role;

    event CFOAdded(address indexed account);
    event CFORemoved(address indexed account);

    Roles.Role private CFOs;

    constructor () internal {
        _addCFO(_msgSender());
    }

    modifier onlyCFO() {
        require(isCFO(_msgSender()), "CFORole: caller does not have the CFO role");
        _;
    }

    function isCFO(address account) public view returns (bool) {
        return CFOs.has(account);
    }

    function addCFO(address account) public onlyCEO {
        _addCFO(account);
    }

    function renounceCFO() public {
        _removeCFO(_msgSender());
    }

    function _addCFO(address account) internal {
        CFOs.add(account);
        emit CFOAdded(account);
    }

    function _removeCFO(address account) internal {
        CFOs.remove(account);
        emit CFORemoved(account);
    }
}

// File: contracts/token/Pausable.sol

pragma solidity ^0.5.1;


/**
 * @dev Contract module which allows children to implement an emergency stop
 * mechanism that can be triggered by an authorized account.
 *
 * This module is used through inheritance. It will make available the
 * modifiers `whenNotPaused` and `whenPaused`, which can be applied to
 * the functions of your contract. Note that they will not be pausable by
 * simply including this module, only once the modifiers are put in place.
 */
contract Pausable is CEORole {
    /**
     * @dev Emitted when the pause is triggered by a pauser (`account`).
     */
    event Paused(address account);

    /**
     * @dev Emitted when the pause is lifted by a pauser (`account`).
     */
    event Unpaused(address account);

    bool private _paused;

    /**
     * @dev Initializes the contract in unpaused state. Assigns the Pauser role
     * to the deployer.
     */
    constructor () internal {
        _paused = false;
    }

    /**
     * @dev Returns true if the contract is paused, and false otherwise.
     */
    function paused() public view returns (bool) {
        return _paused;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is not paused.
     */
    modifier whenNotPaused() {
        require(!_paused, "Pausable: paused");
        _;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is paused.
     */
    modifier whenPaused() {
        require(_paused, "Pausable: not paused");
        _;
    }

    /**
     * @dev Called by a pauser to pause, triggers stopped state.
     */
    function pause() public onlyCEO whenNotPaused {
        _paused = true;
        emit Paused(msg.sender);
    }

    /**
     * @dev Called by a pauser to unpause, returns to normal state.
     */
    function unpause() public onlyCEO whenPaused {
        _paused = false;
        emit Unpaused(msg.sender);
    }
}

// File: contracts/token/Announcement.sol

pragma solidity ^0.5.1;




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
        require(forecast_ > _value, 'forecast has no balance to decrement');
        uint256 oldValue = forecast_;
        forecast_ = forecast_.sub(_value);
        emit ForecastChange(oldValue, forecast_);
        return true;
    }
}

// File: contracts/token/MaxCap.sol

pragma solidity ^0.5.1;




contract MaxCap is CEORole, Pausable {

    using SafeMath for uint;

    uint256 public maxCap_;

    event MaxCapChange (uint256 oldValue, uint256 newValue);

    function maxCap () public view returns (uint256) {
        return maxCap_;
    }

    function increaseMaxCap (uint256 _value) public whenNotPaused onlyCEO returns(bool success) {
       require(_value != 0, 'value not zero');
       uint256 oldValue = maxCap_;
       maxCap_ = maxCap_.add(_value);
       emit MaxCapChange(oldValue, maxCap_);
       return true;
    }

    function decreaseMaxCap (uint256 _value) public whenNotPaused onlyCEO returns(bool success) {
        require(_value != 0, 'value not zero');
        require(_value <= maxCap_, 'value cannot be greater than maxCap');
        uint256 oldValue = maxCap_;
        maxCap_ = maxCap_.sub(_value);
        emit MaxCapChange(oldValue, maxCap_);
        return true;
    }
}

// File: contracts/token/FGToken.sol

pragma solidity ^0.5.1;











/**
 * @title Reference implementation of the ERC223 standard token.
 */
contract FGToken is IERC223, FGTokenDetailed, CEORole, CFORole, Pausable, MaxCap, Announcement{

    using SafeMath for uint;

    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Burn(address indexed burner, uint256 value);
    event Mint(address indexed minter, uint256 value);

    mapping(address => uint) balances;
    mapping (address => mapping (address => uint256)) private _allowances;

    constructor (
        string memory _name, string memory _symbol, 
        uint8 _decimals, uint256 _maxCap) 
        FGTokenDetailed(_name,_symbol,_decimals ) public {
        increaseMaxCap(_maxCap);
    }

    /**
     * @dev Returns balance of the `_owner`.
     *
     * @param _owner   The address whose balance will be returned.
     * @return balance Balance of the `_owner`.
     */
    function balanceOf(address _owner) public view returns (uint balance) {
        return balances[_owner];
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function transfer(address _to, uint _value) public whenNotPaused returns (bool success){
        bytes memory empty;
        _transfer(_msgSender(), _to, _value, empty);
        return true;
    }

     function transfer(address _to, uint _value, bytes memory _data) public whenNotPaused returns (bool success){
        _transfer(_msgSender(), _to, _value, _data);
        return true;
    }

    function _transfer(address sender, address _to, uint _value, bytes memory _data) internal {

        if (balances[sender] < _value) revert("Insuficient funds");

        balances[sender] = balances[sender].sub(_value);
        balances[_to] = balances[_to].add(_value);

        if(Address.isContract(_to)) {
            IERC223Recipient receiver = IERC223Recipient(_to);
            receiver.tokenFallback(sender, _value, _data);
        }
        emit Transfer(sender, _to, _value, _data);
    }

    function approve(address spender, uint256 value) public whenNotPaused returns (bool) {
        _approve(_msgSender(), spender, value);
        return true;
    }

    function _approve(address owner, address spender, uint256 value) internal {

        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = value;
        emit Approval(owner, spender, value);
    }

    function transferFrom(address _sender, address _to, uint256 _amount) public whenNotPaused returns (bool) {
        bytes memory empty = "";
        _transfer(_sender, _to, _amount, empty);
        _approve(_sender, _msgSender(), _allowances[_sender][_msgSender()].sub(_amount));
        return true;
    }

    function allowance(address owner, address spender) public view returns (uint256) {
        return _allowances[owner][spender];
    }

    function increaseAllowance(address spender, uint256 addedValue) public whenNotPaused returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].add(addedValue));
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public whenNotPaused returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].sub(subtractedValue));
        return true;
    }

    /**
     * @dev See {ERC20-_mint}.
     *
     * Requirements:
     *
     * - the caller must have the {MinterRole}.
     */
    function mint(uint256 amount) public onlyCFO whenNotPaused {
        _mint(_msgSender(), amount);
    }

    function _mint(address _account, uint256 _amount) internal {
        require(_account != address(0), "ERC20: mint to the zero address");
        require(_amount <= forecast_, "amount must be less than forecast value");

        bytes memory empty = hex"00000000";

        balances[_account] = balances[_account].add(_amount);
        _totalSupply = _totalSupply.add(_amount);

        emit Mint(_account, _amount);
        emit Transfer(address(0), _account, _amount, empty);
    }

    function burn(uint256 _amount) public onlyCFO whenNotPaused {
        _burn(_msgSender(), _amount);
    }

    function _burn(address _who, uint256 _amount) internal  {
        require(_amount <= balances[_who], "Insuficient funds");
        bytes memory empty = hex"00000000";

        balances[_who] = balances[_who].sub(_amount);
        _totalSupply = _totalSupply.sub(_amount);

        emit Burn(_who, _amount);
        emit Transfer(_who, address(0), _amount, empty);
    }

    /**
    * Forecast
     */
    function increaseForecast(uint256 _value) public whenNotPaused onlyCFO returns ( bool success ){
        uint256 total = forecast() + _value + _totalSupply;
        require(total <= maxCap_, 'the value announcement not be greater than the maxcap');
        super.increaseForecast(_value);
        return true;
    }

}
