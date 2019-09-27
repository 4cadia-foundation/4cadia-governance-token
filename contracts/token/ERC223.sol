pragma solidity ^0.5.1;

import "./IERC223.sol";
import "./IERC223Recipient.sol";
import "../math/SafeMath.sol";
import "../utils/Address.sol";
/**
 * @title Reference implementation of the ERC223 standard token.
 */
contract ERC223Token is IERC223 {

    using SafeMath for uint;

    /**
     * @dev See `IERC223.totalSupply`.
     */
    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    mapping(address => uint) balances; // List of user balances.

    mapping (address => mapping (address => uint256)) private _allowances;

    /**
     * @dev Transfer the specified amount of tokens to the specified address.
     *      Invokes the `tokenFallback` function if the recipient is a contract.
     *      The token transfer fails if the recipient is a contract
     *      but does not implement the `tokenFallback` function
     *      or the fallback function to receive funds.
     *
     * @param _to    Receiver address.
     * @param _value Amount of tokens that will be transferred.
     * @param _data  Transaction metadata.
     */
    function transfer(address _to, uint _value, bytes memory _data) public returns (bool success){
         _transfer(msg.sender, _to, _value, _data);
        return true;
    }

    /**
     * @dev Transfer the specified amount of tokens to the specified address.
     *      This function works the same with the previous one
     *      but doesn't contain `_data` param.
     *      Added due to backwards compatibility reasons.
     *
     * @param _to    Receiver address.
     * @param _value Amount of tokens that will be transferred.
     */
    function transfer(address _to, uint _value) public returns (bool success){
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

    /**
     * @dev Returns balance of the `_owner`.
     *
     * @param _owner   The address whose balance will be returned.
     * @return balance Balance of the `_owner`.
     */
    function balanceOf(address _owner) public view returns (uint balance) {
        return balances[_owner];
    }



    event Approval(address indexed owner, address indexed spender, uint256 value);

    function approve(address spender, uint256 value) public returns (bool) {
        _approve(msg.sender, spender, value);
        return true;
    }

    function _approve(address owner, address spender, uint256 value) internal {

        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = value;
        emit Approval(owner, spender, value);
    }

    function transferFrom(address _sender, address _to, uint256 _amount) public returns (bool) {
        bytes memory empty = hex"00000000";
        _transfer(_sender, _to, _amount, empty);
        _approve(_sender, msg.sender, _allowances[_sender][msg.sender].sub(_amount));
        return true;
    }

    function allowance(address owner, address spender) public view returns (uint256) {
        return _allowances[owner][spender];
    }

}