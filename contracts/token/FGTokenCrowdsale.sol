pragma solidity ^0.5.1;

import '@openzeppelin/contracts/crowdsale/validation/CappedCrowdsale.sol';
import '@openzeppelin/contracts/crowdsale/emission/MintedCrowdsale.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol';
import "@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";
import "@openzeppelin/contracts/crowdsale/validation/TimedCrowdsale.sol";

contract FGTokenCrowdsale is CappedCrowdsale, MintedCrowdsale, TimedCrowdsale {


    constructor (
        uint256 openingTime,
        uint256 closingTime,
        uint256 rate,
        uint256 cap,
        address payable wallet,
        ERC20Mintable token
    )
        public
        Crowdsale(rate, wallet, token)
        CappedCrowdsale(cap)
        TimedCrowdsale(openingTime, closingTime)
    {

    }


}
