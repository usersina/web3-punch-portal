// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract PunchPortal {
    // Should be equal to the sum of all mappings
    uint256 totalPunches;

    // Map earch address to its total number of punches
    mapping(address => uint256) punches;

    constructor() {
        console.log("Smart contract is constructed!");
    }

    function punch() public {
        totalPunches += 1;
        console.log("%s has punched!", msg.sender);
        punches[msg.sender] = punches[msg.sender] + 1;
    }

    function getPunchesByAddress(address owner) public view returns (uint256) {
        return punches[owner];
    }

    function getTotalPunches() public view returns (uint256) {
        console.log("%d is the number of total punches!", totalPunches);
        return totalPunches;
    }
}
