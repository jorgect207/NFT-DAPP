const { ethers, network, getNamedAccounts, deployments } = require("hardhat");
const {
  developmentNetwork,
  networkConfig,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

//pinata storgae

let tokenUris = "ipfs://QmRV8uaU554UGKz1TMkeSNT3vDSVXG7J347yZpNbBShhC7";
const imagesLocation = "./images/";

const metadataTemplate = {
  name: "",
  description: "",
  image: "",
  attributes: [
    {
      trait_type: "Cuteness",
      value: 100,
    },
  ],
};

//script
module.exports = async function () {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const chainId = network.config.chainId;

  const whitelistContract = "0xbFeA830e540C69CaFa05247C4C12488D78D7b155";

  const arg = [tokenUris, whitelistContract];

  const NftMint = await deploy("NftSimple", {
    from: deployer,
    args: arg,
    log: true,
    waitConfirmation: network.config.blockConfirmation || 1,
  });

  if (!developmentNetwork.includes(network.name)) {
    log("Verifying...");
    await verify(NftMint.address, arg);
  }
};

module.exports.tags = ["all", "simpleNft"];
