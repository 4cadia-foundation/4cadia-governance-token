pragma solidity ^0.5.1;

import "./IERC223.sol";

import "./IERC223Recipient.sol";
import "./FGTokenDetailed.sol";
import "../math/SafeMath.sol";
import "../utils/Address.sol";
import "../access/roles/CFORole.sol";
import "../access/roles/CEORole.sol";
import "./Pausable.sol";

/**
 * @title Reference implementation of the ERC223 standard token.
 */
contract FGToken is IERC223, FGTokenDetailed, CFORole, CEORole, Pausable {

    using SafeMath for uint;

    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Burn(address indexed burner, uint256 value);

    mapping(address => uint) balances; // List of user balances.
    mapping (address => mapping (address => uint256)) private _allowances;

    constructor (string memory _name, string memory _symbol, uint8 _decimals, uint256 initialSupply) FGTokenDetailed(_name,_symbol,_decimals ) public {
        mint(_msgSender(), initialSupply);
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
    function mint(address account, uint256 amount) public onlyCFO returns (bool) {
        _mint(account, amount);
    }

    function _mint(address account, uint256 amount) internal {
        require(account != address(0), "ERC20: mint to the zero address");
        bytes memory empty = hex"00000000";
        _totalSupply = _totalSupply.add(amount);
        balances[account] = balances[account].add(amount);
        emit Transfer(address(0), account, amount, empty);
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
}