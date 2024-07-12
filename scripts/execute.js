const hre = require("hardhat");
// const { ethers } = require("ethers");

const ENTRYPOINT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const FACTORY_NOUNCE = 1;
const FACTORY_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

async function main() {

  // Get the EntryPoint contract
  const EPoint = await hre.ethers.getContractAt("EntryPoint", ENTRYPOINT_ADDRESS);
  const sender = await hre.ethers.getCreateAddress({ from: FACTORY_ADDRESS, nonce: FACTORY_NOUNCE });
    
  console.log("Sender", sender);
  
  // Use the function from the accountFactory
  const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");
  const [signer0] = await hre.ethers.getSigners();
  const address0 = await signer0.getAddress();

//   const initCode = FACTORY_ADDRESS + AccountFactory.interface.encodeFunctionData("createAccount", [address0]).slice(2);  // its for initial account deployment
  const initCode = "0x";
  
  // Use the function from the account
  const Account = await hre.ethers.getContractFactory("Account");

  //   await EPoint.depositTo(sender,{
//     value: hre.ethers.parseUnits("10", "ether") // Ensure this is a hex string
//   })


  const userOp = {
    sender,
    nonce: await EPoint.getNonce(sender, 0),
    initCode,
    callData: Account.interface.encodeFunctionData("execute"),
    callGasLimit: 200_000,
    verificationGasLimit: 200_000,
    preVerificationGas: 50_000,
    maxFeePerGas: ethers.parseUnits("10", "gwei"),
    maxPriorityFeePerGas: ethers.parseUnits("5", "gwei"), 
    paymasterAndData: "0x", // we're not using a paymaster, for now
    signature: "0x", // we're not validating a signature, for now
  }

  // console.log("accountGasLimits, preVerificationGas, gasFees", userOp.accountGasLimits,userOp.preVerificationGas,userOp.gasFees);

  try {
    // Sending a transaction using handleOps and waiting for it to be mined
    const tx = await EPoint.handleOps([userOp], address0);
    const receipt = await tx.wait();
    console.log("receipt:", receipt);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Run the main function and catch any errors
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
