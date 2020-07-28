# Devex - Zilliqa Dev Explorer

This is a developer-focused lightweight explorer to connect to the Zilliqa's networks and local testnets.

As an explorer, Devex is unable to interact with the blockchain other than pulling and displaying data.
If you wish to interact with the blockchain (i.e. create contracts, create transactions and so on..), do check out our feature-filled Scilla IDE (https://ide.zilliqa.com/#/)

Features
---
* Built on top of Zilliqa's Javascript Library
* Provides developers with an intuitive GUI to explore any Zilliqa network
* Detailed and organised display for the following data:
    * Accounts
    * Contracts
    * Transactions
    * DS Blocks
    * Transaction Blocks
* Allows developers to add local testnets to the list of default networks to switch between
* Supports exploring of Zilliqa Isolated Servers. More info on Isolated Servers here (https://github.com/Zilliqa/Zilliqa/blob/master/ISOLATED_SERVER_setup.md)
* Labelling System that allows developers to save often-visited entities, and share it using the import/export feature
* Dark Mode

Setting Up
---

## Available Scripts
* `yarn install` to install dependencies
* `yarn start` to run the app on `localhost:3000`
* `yarn build` to build the app for production

Preloading Networks
---

The explorer allows developers to define default networks to be shipped with the explorer

This is done by adding a JSON file named `networks.json` into public folder `%PROJ_DIR%/public` before building the application
or injecting it into the build post-build into the build's root directory `%BUILD_DIR%/`

Format: Array of key-value pairs where the network url is the key and the network name is the value

An example is given below

```
  {
    "networks": [
      {"https://api.zilliqa.com" : "Mainnet"},
      {"https://dev-api.zilliqa.com" : "Testnet"},
      {"https://zilliqa-isolated-server.zilliqa.com" : "Isolated Server"}
    ]
  }
```
