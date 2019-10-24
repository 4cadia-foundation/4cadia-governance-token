# 4Cadia Governance Token
[![Build Status CircleCI](https://circleci.com/gh/4cadia-foundation/4cadia-governance-token/tree/develop.svg?style=svg)](https://circleci.com/gh/4cadia-foundation/4cadia-governance-token/tree/develop)
# What is 4Cadia Token?
4GT is an asset token, collateralized 1:1 to 4CADIA Foundation voting shares through a legal framework.
  - 4GT are issued as ERC223 compatible tokens and can be stored and transacted using any wallet or service that support its integration on the Ethereum network.
  - In the future, 4GT tokens inside the Ethereum blockchain are going to be swapped 1:1 with 4GT inside 4CADIA blockchain ecosystem.
  
Having 1 4GT is the same as having 1 voting share of 4CADIA Foundation, but without the bureaucratic hassle of handling voting shares.
## How do I get 4GT Token?
Brand new 4GT can only be acquired by bidding in the 4GT Auctions that 4CADIA issue periodically. Once these tokens are in custody of the end users, they can be traded freely on the secondary market.
The tokens can be bought directly from the crowdsale smart contract using compatible tokens, or through a dedicated platform using Fiat money, Bitcoin or other cryptocurrencies.
All bids placed on auctions are private. When placing a bid it is impossible to see other bids, so every bidder must choose its price per token and amount of purchase carefully to win a bid.
### Token Structure
| Function | Description |
| ------ | ------ |
| name | Used to specify token contracts and external applications|
| symbol| Helps ensure its compatibility with the ERC20 standard and provides external programs with its short name|
| totalSupply| This function indicates the total number of tokens in the blockchain|
| balanceOf| Using this function you can find the number of tokens that have an established address|
| transfer(address, uint, bytes)| A function that is always called when someone wants to transfer tokens|
| transfer(address, uint)| Required for backward compatibility reasons|
| tokenFallback | Functions for handling the transfer token|
| transferFrom| Transfers the number of tokens from one address to another|
| approve| Allows the sender to withdraw amounts from his account several times. That is, is a confirmation|
| allowance| Returns the number from which the sender is still allowed to withdraw money|
### Instalation
Token requires:
 - [Node.js](https://nodejs.org/) v10+ to run.
 - [Truffle](https://www.npmjs.com/package/truffle) version 5.0.39.
 - [Ganache-cli](https://www.npmjs.com/package/ganache-cli) version 6.7.0.
Install the dependencies and devDependencies and start the server.
```sh
$ cd ~/4cadia-governance-token
$ npm install
```
#### Development
Running in mode develop with ganache-cli:
```sh
$ ~/4cadia-governance-token/ganache-cli
```
Truffle Migrate Token:
```sh
$ ~/4cadia-governance-token/truffle migrate
```
Truffle Compile Token:
```sh
$ ~/4cadia-governance-token/truffle compile
```
Running unit test:
```sh
$ ~/4cadia-governance-token/npm test
```
### References
- [Tech](./docs/tecnologies.md)
- [Git Workflow](./docs/workflow.md)
- [Semantic Versioning](./docs/semantic-versioning.md)
- [Structure Repository](./docs/software-structure.md)
- [Code Quality](./docs/code-quality.md)