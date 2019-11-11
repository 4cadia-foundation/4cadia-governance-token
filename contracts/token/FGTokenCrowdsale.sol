pragma solidity ^0.5.1;

import '@openzeppelin/contracts/math/SafeMath.sol';
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";


/**
 * @title Reference implementation of the Crowdsale contract.
 */
contract FGTokenCrowdsale is ReentrancyGuard {

    using SafeMath for uint256;
    using SafeERC20 for IERC20;


    IERC20 private _token;

    uint256 private _rate;

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
        ERC20Mintable token
    )
        public
    {
        _wallet = wallet;
        _token = token;
        _rate = rate;
    }

    function () external payable {
        buyTokens(msg.sender);
    }


    function buyTokens(address beneficiary) public nonReentrant payable {
        require(beneficiary != address(0), "Crowdsale: beneficiary is the zero address");
        require(msg.value != 0, "Crowdsale: weiAmount is 0");

        uint256 weiAmount = msg.value;

        uint256 tokens = (weiAmount.div(10**10)) * _rate;

        _weiRaised = _weiRaised.add(weiAmount);

        _token.safeTransfer(beneficiary, tokens);

        emit TokensPurchased(msg.sender, beneficiary, weiAmount, tokens);
        _forwardFunds();
    }

    /**
     * @return the amount of wei raised.
     */
    function weiRaised() public view returns (uint256) {
        return _weiRaised;
    }

    /**
     * @dev Determines how ETH is stored/forwarded on purchases.
    */
    function _forwardFunds() internal {
        _wallet.transfer(msg.value);
    }


    /**
     * @return the number of token units a buyer gets per wei.
     */
    function rate() public view returns (uint256) {
        return _rate;
    }




}
