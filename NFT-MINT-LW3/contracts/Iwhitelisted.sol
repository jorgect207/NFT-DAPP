// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

interface Iwhitelisted {
    function whitelistedAddresses(address) external view returns (bool);
}
