
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
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);
    
    /**
     * @dev Returns the balance of the `who` address.
     */
    function balanceOf(address who) external view returns (uint256);
        
    /**
     * @dev Transfers `value` tokens from `msg.sender` to `to` address
     * and returns `true` on success.
     */
    function transfer(address to, uint256 value) external returns (bool success);
        
    /**
     * @dev Transfers `value` tokens from `msg.sender` to `to` address with `data` parameter
     * and returns `true` on success.
     */
    function transfer(address to, uint256 value, bytes calldata data) external returns (bool success);
     
     /**
     * @dev Event that is fired on successful transfer.
     */
    event Transfer(address indexed from, address indexed to, uint256 value, bytes data);
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

// File: @openzeppelin/contracts/token/ERC20/IERC20.sol

pragma solidity ^0.5.0;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP. Does not include
 * the optional functions; to access them see `ERC20Detailed`.
 */
interface IERC20 {
    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `recipient`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a `Transfer` event.
     */
    function transfer(address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through `transferFrom`. This is
     * zero by default.
     *
     * This value changes when `approve` or `transferFrom` are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * > Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an `Approval` event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `sender` to `recipient` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a `Transfer` event.
     */
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to `approve`. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

// File: @openzeppelin/contracts/token/ERC20/ERC20Detailed.sol

pragma solidity ^0.5.0;


/**
 * @dev Optional functions from the ERC20 standard.
 */
contract ERC20Detailed is IERC20 {
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

// File: @openzeppelin/contracts/access/Roles.sol

pragma solidity ^0.5.0;

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

// File: @openzeppelin/contracts/math/SafeMath.sol

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
        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
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

// File: contracts/access/roles/CeoCfoRole.sol

pragma solidity ^0.5.1;



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

// File: contracts/access/roles/MaxCapRole.sol

pragma solidity ^0.5.1;


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

// File: contracts/access/roles/ComplianceRole.sol

pragma solidity ^0.5.1;




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

// File: contracts/access/roles/WhitelistedRole.sol

pragma solidity ^0.5.1;


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

    modifier onlyWhitelisted() {
        require(isWhitelisted(msg.sender), "WhitelistedRole: onlyWhitelisted");
        _;
    }

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

// File: contracts/token/Pausable.sol

pragma solidity ^0.5.1;


/**
 * @dev Contract module which allows children to implement an emergency stop
 * mechanism that can be triggered by an authorized account.
 *
 * This module is used through inheritance. It will make available the
 * modifiers `whenNotPaused` and `whenPaused`, which can be applied to
 * the functions of your contract. Note that they will not be pausable by
 * simply including this module, only once the modifiers are put in place. *
 * Based in: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/lifecycle/Pausable.sol
 */
contract Pausable is CeoCfoRole {
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

// File: contracts/utils/Address.sol

pragma solidity ^0.5.0;

/**
 * @dev Collection of functions related to the address type
 */
library Address {
    /**
     * @dev Returns true if `address` is a contract.
     *
     * This test is non-exhaustive, and there may be false-negatives: during the
     * execution of a contract's constructor, its address will be reported as
     * not containing a contract.
     *
     * > It is unsafe to assume that an address for which this function returns
     * false is an externally-owned account (EOA) and not a contract.
     */
    function isContract(address _address) internal view returns (bool) {
        // This method relies in extcodesize, which returns 0 for contracts in
        // construction, since the code is only stored at the end of the
        // constructor execution.

        uint256 length;
        // solhint-disable-next-line no-inline-assembly
        assembly {
            //retrieve the size of the code on target address, this needs assembly
            length := extcodesize(_address)
        }
        return length > 0;
    }

    /**
     * @dev Converts an `address` into `address payable`. Note that this is
     * simply a type cast: the actual underlying value is not changed.
     */
    function toPayable(address _address) internal pure returns (address payable) {
        return address(uint160(_address));
    }
}

// File: contracts/token/FGToken.sol

pragma solidity 0.5.1;









/**
 * @title Reference implementation of the ERC223 standard token.
 */
contract FGToken is IERC223, ERC20Detailed, CeoCfoRole, Pausable, MaxCapRole, ComplianceRole, WhitelistedRole {
    using SafeMath for uint256;

    mapping(address => uint256) _balances;
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
        _forecastWait = _duration * 1 days;
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
