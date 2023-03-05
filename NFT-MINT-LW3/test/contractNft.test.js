const { deployments, getNamedAccounts, network, ethers } = require("hardhat");
const {
  developmentNetwork,
  networkConfig,
} = require("../helper-hardhat-config");
const { assert, expect } = require("chai");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

if (developmentNetwork.includes(network.name)) {
  describe("main", async function () {
    let NftMint;
    let publicPrice;
    beforeEach(async function () {
      const { deploy, log } = deployments;
      const { deployer } = await getNamedAccounts();

      await deployments.fixture(["all"]);
      NftMint = await ethers.getContract("NftMint");
      publicPrice = ethers.utils.parseEther("0.2");
    });

    describe("prpving state public", async function () {
      it("proving state", async function () {
        await NftMint.changeState(2);
        const getState = await NftMint.stateMint();
        console.log(publicPrice.toString());
        assert.equal(getState, 2);
      });
    });

    describe("prpving mint", async function () {
      it("mint public", async function () {
        await time.increase(3600);
        await NftMint.changeState(2);
        await expect(NftMint.mintPublic({ value: publicPrice })).to.emit(
          NftMint,
          "mint"
        );
      });
    });
  });
}
