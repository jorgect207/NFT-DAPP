import React, { useState } from "react";
import { abi, contractAddress } from "../constants/index";
import { ethers } from "ethers";

import { useWeb3Contract, useMoralis } from "react-moralis";
import { useNotification } from "@web3uikit/core";

import log from "loglevel";

const useWeb3Connection = () => {
  const mintPublicPrice = ethers.parseEther("0.2");
  const mintPrivtePrice = ethers.parseEther("0.1");

  // const mintPublicPrice = parseEther("0.2");
  // const mintPrivtePrice = parseEther("0.1");
  const dispatch = useNotification();

  const handleNotification = async () => {
    dispatch({
      type: "success",
      title: "you mint 1 Nft",
      position: "topR",
    });
  };

  const handleNotificationSucces = async () => {
    dispatch({
      type: "success",
      title: "transaction success",
      position: "topR",
    });
  };

  const {
    isWeb3EnableLoading,
    chainId: chainIdHex,
    account,
    isWeb3Enabled,
    useApiContract,
  } = useMoralis();

  const chainId = parseInt(chainIdHex);

  // const nftContractAddress = "0x155eC280EaCA44da3D5aF0fBA1B599dda6F932AB";
  // try {
  //   const nftContractAddress = contractAddress[chainId][0];
  // } catch (e) {

  // }

  const nftContractAddress =
    chainId in contractAddress ? contractAddress[chainId][0] : null;
  log.warn(nftContractAddress);

  //runing mintPublic function
  const { runContractFunction: mintPublic } = useWeb3Contract({
    abi: abi,
    contractAddress: nftContractAddress,
    functionName: "mintPublic",
    msgValue: mintPublicPrice,
  });

  async function mintPublicNft() {
    await mintPublic({
      onSuccess: handleNotification,
    });
  }

  //runing mintPirvate function

  const { runContractFunction: mintPrivate } = useWeb3Contract({
    abi: abi,
    contractAddress: nftContractAddress,
    functionName: "mintWhilisted",
    msgValue: mintPrivtePrice,
  });

  async function mintPrivateNft() {
    await mintPrivate({
      onSuccess: handleNotification,
    });
  }

  //runing stop function
  const { runContractFunction: stop } = useWeb3Contract({
    abi: abi,
    contractAddress: nftContractAddress,
    functionName: "stop",
  });

  async function stopContract() {
    await stop({
      onSuccess: handleNotificationSucces,
    });
  }

  //runing changeState function

  const { runContractFunction: changeState } = useWeb3Contract({
    abi: abi,
    contractAddress: nftContractAddress,
    functionName: "changeState",
    params: {
      _state: "2",
    },
  });

  async function changeStateToPublic() {
    await changeState({
      onSuccess: handleNotificationSucces,
    });
  }

  //withdrawall money
  const { runContractFunction: withdraw } = useWeb3Contract({
    abi: abi,
    contractAddress: nftContractAddress,
    functionName: "withdraw",
  });

  async function withdrawMoney() {
    await withdraw({
      onSuccess: handleNotificationSucces,
    });
  }

  //OWNER
  const { runContractFunction: owner } = useWeb3Contract({
    abi: abi,
    contractAddress: nftContractAddress,
    functionName: "owner",
  });

  async function gettingOwner() {
    return await owner({});
  }

  //getting state
  const { runContractFunction: stateMint } = useWeb3Contract({
    abi: abi,
    contractAddress: nftContractAddress,
    functionName: "stateMint",
  });

  async function gettingState() {
    return await stateMint({});
  }

  return {
    withdrawMoney,
    changeStateToPublic,
    stopContract,
    mintPrivateNft,
    mintPublicNft,
    gettingOwner,
    gettingState,
    account,
  };
};
export default useWeb3Connection;
