const { network, ethers } = require("hardhat");
const fs = require("fs-extra");
require("dotenv").config();

const Front_end_address =
  "../nft-dapp/src/components/constants/contractAddress.json";
const Front_end_abi = "../nft-dapp/src/components/constants/abi.json";

module.exports = async function () {
  if (process.env.FRONT_END) {
    await updateAbi();
    await updateContractAddress();
  }
  console.log("updated!!");
};

async function updateAbi() {
  const NftMint = await ethers.getContract("NftMint");
  fs.writeFileSync(
    Front_end_abi,
    NftMint.interface.format(ethers.utils.FormatTypes.json)
  );
}

async function updateContractAddress() {
  const NftMint = await ethers.getContract("NftMint");

  const readedFile = fs.readFileSync(Front_end_address, "utf8");
  console.log(readedFile);
  console.log("checkpoint");

  const contractAddress = JSON.parse(readedFile);

  const chainId = network.config.chainId.toString();
  if (chainId in contractAddress) {
    if (!contractAddress[chainId].includes(NftMint.address)) {
      contractAddress[chainId].push(NftMint.address);
    }
  } else {
    contractAddress[chainId] = [NftMint.address];
  }
  fs.writeFileSync(Front_end_address, JSON.stringify(contractAddress));
}
module.exports.tags = ["all", "frontend"];
