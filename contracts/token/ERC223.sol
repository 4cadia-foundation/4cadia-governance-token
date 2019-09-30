pragma solidity ^0.5.1;

import "./IERC223.sol";
import "./IERC223Recipient.sol";
import "../math/SafeMath.sol";
import "../utils/Address.sol";
import "@openzeppelin/contracts/lifecycle/Pausable.sol";

/**
 * @title Reference implementation of the ERC223 standard token.
 */
contract ERC223Token is IERC223, Pausable {

    using SafeMath for uint;

    event Burn(address indexed burner, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    mapping(address => uint) balances; // List of user balances.
    mapping (address => mapping (address => uint256)) private _allowances;



    function balanceOf(address _owner) public view returns (uint balance) {
        return balances[_owner];
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function transfer(address _to, uint _value, bytes memory _data) public whenNotPaused returns (bool success){
         _transfer(msg.sender, _to, _value, _data);
        return true;
    }

    function transfer(address _to, uint _value) public whenNotPaused returns (bool success){
        bytes memory empty = hex"00000000";
        _transfer(msg.sender, _to, _value, empty);
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
        _approve(msg.sender, spender, value);
        return true;
    }

    function _approve(address owner, address spender, uint256 value) internal {

        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = value;
        emit Approval(owner, spender, value);
    }

    function transferFrom(address _sender, address _to, uint256 _amount) public whenNotPaused returns (bool) {
        bytes memory empty = hex"00000000";
        _transfer(_sender, _to, _amount, empty);
        _approve(_sender, msg.sender, _allowances[_sender][msg.sender].sub(_amount));
        return true;
    }

    function allowance(address owner, address spender) public view returns (uint256) {
        return _allowances[owner][spender];
    }

    function increaseAllowance(address spender, uint256 addedValue) public whenNotPaused returns (bool) {
        _approve(msg.sender, spender, _allowances[msg.sender][spender].add(addedValue));
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public whenNotPaused returns (bool) {
        _approve(msg.sender, spender, _allowances[msg.sender][spender].sub(subtractedValue));
        return true;
    }


    function burn(uint256 _value) public whenNotPaused {
        _burn(msg.sender, _value);
    }

    function _burn(address _who, uint256 _value) internal {
        require(_value <= balances[_who], "Insuficient funds");
        bytes memory empty = hex"00000000";

        balances[_who] = balances[_who].sub(_value);
        _totalSupply = _totalSupply.sub(_value);

        emit Burn(_who, _value);
        emit Transfer(_who, address(0), _value, empty);
    }


}