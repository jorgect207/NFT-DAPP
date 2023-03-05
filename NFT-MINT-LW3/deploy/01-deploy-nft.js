const { ethers, network, getNamedAccounts, deployments } = require("hardhat");
const {
  developmentNetwork,
  networkConfig,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const {
  storeImages,
  storeTokenUriMetadata,
} = require("../utils/uploadToPinata");

//pinata storgae

let tokenUris = [
  "ipfs://QmRV8uaU554UGKz1TMkeSNT3vDSVXG7J347yZpNbBShhC7",
  "ipfs://QmaVkBn2tKmjbhphU7eyztbvSQU5EXDdqRyXZtRhSGgJGo",
  "ipfs://QmYQC5aGZu2PTH8XzbJrbDnvhj3gVs7ya33H9mqUNvST3d",
  "ipfs://QmZYmH5iDbD6v3U2ixoVAjioSzvWJszDzYdbeCLquGSpVm",
];
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

  if (process.env.UPLOAD_TO_PINATA == "true") {
    tokenUris = await handleTokenUris();
  }

  const whitelistContract = networkConfig[chainId].whitelistContract;

  const arg = [whitelistContract, tokenUris];

  const NftMint = await deploy("NftMint", {
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

async function handleTokenUris() {
  // Check out https://github.com/PatrickAlphaC/nft-mix for a pythonic version of uploading
  // to the raw IPFS-daemon from https://docs.ipfs.io/how-to/command-line-quick-start/
  // You could also look at pinata https://www.pinata.cloud/
  tokenUris = [];
  const { responses: imageUploadResponses, files } = await storeImages(
    imagesLocation
  );
  for (const imageUploadResponseIndex in imageUploadResponses) {
    let tokenUriMetadata = { ...metadataTemplate };
    tokenUriMetadata.name = files[imageUploadResponseIndex].replace(".png", "");
    tokenUriMetadata.description = `An adorable ${tokenUriMetadata.name} pup!`;
    tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`;
    console.log(`Uploading ${tokenUriMetadata.name}...`);
    const metadataUploadResponse = await storeTokenUriMetadata(
      tokenUriMetadata
    );
    tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`);
  }
  console.log("Token URIs uploaded! They are:");
  console.log(tokenUris);
  return tokenUris;
}

module.exports.tags = ["all", "whitelist"];
