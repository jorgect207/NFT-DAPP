/** @type import('hardhat/config').HardhatUserConfig */

require("@nomiclabs/hardhat-ethers");
require("dotenv").config();
require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-etherscan");
require("@nomicfoundation/hardhat-foundry");
require("@nomicfoundation/hardhat-chai-matchers");
require("hardhat-deploy");

const URL = process.env.GOERLY_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const VERIFICATION = process.env.ETHERSCAN_VERICATION;

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    goerli: {
      chainId: 5,
      url: URL,
      accounts: [PRIVATE_KEY],
      blockConfirmations: 6,
    },
  },
  etherscan: {
    apiKey: {
      goerli: VERIFICATION,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    player: {
      default: 1,
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  mocha: {
    timeout: 800000, // 500 seconds max for running tests
  },

  solidity: {
    compilers: [
      {
        version: "0.8.4",
      },
    ],
  },
};
