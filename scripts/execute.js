const hre = require("hardhat");
// const { ethers } = require("ethers");

const ENTRYPOINT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const FACTORY_NOUNCE = 1;
const FACTORY_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const PAYMASTER_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

async function main() {

  // Get the EntryPoint contract
  const EPoint = await hre.ethers.getContractAt("EntryPoint", ENTRYPOINT_ADDRESS);
  const sender = await hre.ethers.getCreateAddress({ from: FACTORY_ADDRESS, nonce: FACTORY_NOUNCE });
    
  console.log({ sender });
  
  // Use the function from the accountFactory
  const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");
  const [signer0,signer1] = await hre.ethers.getSigners();
  const address0 = await signer0.getAddress();

  const initCode = "0x";
  // const initCode = FACTORY_ADDRESS + AccountFactory.interface.encodeFunctionData("createAccount", [address0]).slice(2);  // its for initial account deployment
  
  // Use the function from the account
  const Account = await hre.ethers.getContractFactory("Account");

//   Deposite the initial payment to paymasters
  //   await EPoint.depositTo(PAYMASTER_ADDRESS, {
  //   value: hre.ethers.parseUnits("2", "ether") // Ensure this is a hex string
  // })


  const userOp = {
    sender,
    nonce: await EPoint.getNonce(sender, 0),
    initCode,
    callData: Account.interface.encodeFunctionData("execute"),
    callGasLimit: 500_000,
    verificationGasLimit: 500_000,
    preVerificationGas: 50_000,
    maxFeePerGas: ethers.parseUnits("10", "gwei"),
    maxPriorityFeePerGas: ethers.parseUnits("5", "gwei"), 
    paymasterAndData: PAYMASTER_ADDRESS, // we're not using a paymaster, for now
    signature: "0x", // we're not validating a signature, for now
  }
    const userOpHash = await EPoint.getUserOpHash(userOp);
    userOp.signature = signer0.signMessage(hre.ethers.getBytes(userOpHash));

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
