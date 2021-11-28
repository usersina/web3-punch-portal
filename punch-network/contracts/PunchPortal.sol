// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract PunchPortal {
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

    constructor() {
        console.log("Smart contract is constructed!");
    }

    function punch(string memory _message) public {
        totalPunches += 1;
        console.log("%s has punched!", msg.sender);

        // Store the punch in the punches array
        punches.push(Punch(msg.sender, _message, block.timestamp));

        // Emit an event to be catched in the frontend
        emit NewPunch(msg.sender, block.timestamp, _message);
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
