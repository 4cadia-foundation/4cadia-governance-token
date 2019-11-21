pragma solidity ^0.5.1;

import '@openzeppelin/contracts/math/SafeMath.sol';
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";


contract Oracle {

    function __callback(bytes32 _myid, string memory _result) public {}

    function getETHValue() public payable{}

    function priceEth() public view returns(uint256) {}

    function datetimePrice() public view returns (uint256){}
}


/**
 * @title Reference implementation of the Crowdsale contract.
 */
contract FGTokenPreSale is ReentrancyGuard {

    using SafeMath for uint256;
    using SafeERC20 for IERC20;


    IERC20 private _token;

    uint256 private _rate;

    address public _oracleAddress;

    uint256 private _weiRaised;

    address payable private _wallet;

    /**
     * Event for token purchase logging
     * @param purchaser who paid for the tokens
     * @param beneficiary who got the tokens
     * @param value weis paid for purchase
     * @param amount amount of tokens purchased
     */
    event TokensPurchased(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);

    constructor (
        uint256 rate,
        address payable wallet,
        ERC20Mintable token,
        address oracleAddress
    )
        public
    {
        _wallet = wallet;
        _token = token;
        _rate = rate;
        _oracleAddress = oracleAddress;
    }

    function () external payable {
        buyTokens(msg.sender);
    }

    function buyTokens(address beneficiary) public nonReentrant payable {
        require(beneficiary != address(0), "Pre-Sale: beneficiary is the zero address");
        require(msg.value != 0, "Pre-Sale: weiAmount is 0");

        uint256 weiAmount = msg.value;
        uint256 sellingRate = priceEth();

        uint256 amountWithRate = weiAmount.mul(sellingRate);
        amountWithRate = amountWithRate.div(100);

        uint256 tokenConversion = amountWithRate.div(1e10);
        uint256 tokens = tokenConversion * _rate;

        if (tokens < 1)
            revert("Operation balance cannot be less than one token");

        _weiRaised = _weiRaised.add(weiAmount);

        _token.safeTransfer(beneficiary, tokens);

        emit TokensPurchased(msg.sender, beneficiary, weiAmount, tokens);

        _wallet.transfer(msg.value);
    }
    

    /**
     * @return the price of ether
     */
    function priceEth() public view returns(uint256) {
        Oracle oracle = Oracle(_oracleAddress);
        return oracle.priceEth();
    }


    /**
     * @return the amount of wei raised.
     */
    function weiRaised() public view returns (uint256) {
        return _weiRaised;
    }

    /**
     * @return the number of token units a buyer gets per wei.
     */
    function rate() public view returns (uint256) {
        return _rate;
    }

}