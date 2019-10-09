# 4Cadia Governance Token

[![Build Status]()]()

# What is 4Cadia Token?

4GT is an asset token, collateralized 1:1 to 4CADIA Foundation voting shares through a legal framework.

  - 4GT are issued as ERC223 compatible tokens and can be stored and transacted using any wallet or service that support its integration on the Ethereum network.
  - In the future, 4GT tokens inside the Ethereum blockchain are going to be swapped 1:1 with 4GT inside 4CADIA blockchain ecosystem.
  
Having 1 4GT is the same as having 1 voting share of 4CADIA Foundation, but without the bureaucratic hassle of handling voting shares.

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
