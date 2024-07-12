// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "@account-abstraction/contracts/core/EntryPoint.sol";
import "@account-abstraction/contracts/interfaces/IAccount.sol";

contract Account is IAccount{
    address public owner;
    uint256 public count;

    constructor(address _owner) {
        owner = _owner;
    }

    function validateUserOp(
        UserOperation calldata,
        bytes32,
        uint256
    ) external pure  returns (uint256 validationData){
        return 0;
    }

    // This is our state changing function, which could be called anything
    function execute() external {
        count++;
    }
}

contract AccountFactory {
    function createAccount(address _owner) public returns (address) {
        Account newAccount = new Account(_owner);
        return address(newAccount);
    }
}