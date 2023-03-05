const developmentNetwork = ["localhost", "hardhat"];

const networkConfig = {
  5: {
    name: "goerly",
    whitelistContract: "0xbFeA830e540C69CaFa05247C4C12488D78D7b155",
  },
  31337: {
    name: "hardhat",
    whitelistContract: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  },
};

module.exports = { developmentNetwork, networkConfig };
