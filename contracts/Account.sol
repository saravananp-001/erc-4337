// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
import "hardhat/console.sol";

import "@account-abstraction/contracts/core/EntryPoint.sol";
import "@account-abstraction/contracts/interfaces/IAccount.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Create2.sol";

contract Account is IAccount{
    address public owner;
    uint256 public count;

    constructor(address _owner) {
        owner = _owner;
    }

    // validate against the owner sign by the userOpHash and string
    function validateUserOp(
        UserOperation calldata userOp,
        bytes32 userOpHash,
        uint256
    ) external view  returns (uint256 validationData){
        console.log("inside the validareUserOp");
        address recovered = ECDSA.recover(ECDSA.toEthSignedMessageHash(userOpHash), userOp.signature);
        return owner == recovered ? 0 : 1;
    }

    // This is our state changing function, which could be called anything
    function execute() external {
        count++;
    }
}

contract AccountFactory {
    function createAccount(address _owner) public returns (address) {
        // This is basic create methode
        // Account newAccount = new Account(_owner);
        // return address(newAccount);

        // This is create2 methode
        // uint256 amount, bytes32 salt, bytes memory bytecode
        bytes32 salt =bytes32(bytes20(uint160(_owner)));
        bytes memory bytecode = abi.encodePacked(type(Account).creationCode, abi.encode(_owner));

        address addr = Create2.computeAddress(salt, keccak256(bytecode));
        if(addr.code.length > 0){
            return addr;
        }

        return Create2.deploy(0,salt,bytecode);

    }
}