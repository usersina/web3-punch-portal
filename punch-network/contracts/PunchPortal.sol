// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract PunchPortal {
    // Used to generate a "random" number
    uint256 private seed;

    // Should be equal to the sum of all mappings
    uint256 totalPunches;

    event NewPunch(address indexed from, uint256 timestamp, string message);

    // Custom datatype
    struct Punch {
        address puncher; // The address of the user who punched.
        string message; // The message the user sent.
        uint256 timestamp; // The timestamp when the user punched.
    }

    Punch[] punches;

    // Link address to the last time a user punched
    mapping(address => uint256) lastPunchedAt;

    constructor() payable {
        console.log("Smart contract is constructed!");

        // Generate the first contract seed value
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function punch(string memory _message) public {
        require(
            lastPunchedAt[msg.sender] + 5 minutes < block.timestamp,
            "Wait 5 minutes before punching again!"
        );

        lastPunchedAt[msg.sender] = block.timestamp;

        totalPunches += 1;
        console.log("%s has punched!", msg.sender);

        // Store the punch in the punches array
        punches.push(Punch(msg.sender, _message, block.timestamp));

        // Emit an event to be catched in the frontend
        emit NewPunch(msg.sender, block.timestamp, _message);

        // Generate a new seed for the next user
        seed = (block.difficulty + block.timestamp + seed) % 100;

        console.log("Generated seed: %s", seed);
        if (seed <= 40) {
            // 50% change to get 0.0001 ether as a reward
            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money that the contract has!"
            );

            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract!");
        }
    }

    function getAllPunches() public view returns (Punch[] memory) {
        return punches;
    }

    function getPunchesNumberByAddress(address owner)
        public
        view
        returns (uint256)
    {
        uint256 punchesNumber = 0;
        for (uint256 index = 0; index < punches.length; index++)
            if (punches[index].puncher == owner) punchesNumber++;

        return punchesNumber;
    }

    function getTotalPunches() public view returns (uint256) {
        console.log("%d is the number of total punches!", totalPunches);
        return totalPunches;
    }
}
