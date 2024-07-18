const hre = require("hardhat");
// const { ethers } = require("ethers");

const ENTRYPOINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const FACTORY_ADDRESS = "0xa6C10A9ccC9e6B968D80841017816b9a8cf96936";
const PAYMASTER_ADDRESS = "0x41931204Cdcd6Ed02A66c5285ab62889B3d3688b";

async function main() {

  // Get the EntryPoint contract
  const EPoint = await hre.ethers.getContractAt("EntryPoint", ENTRYPOINT_ADDRESS);
  
  // Use the function from the accountFactory
  const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");
  const [signer0] = await hre.ethers.getSigners();
  const address0 = await signer0.getAddress();
  console.log("address0",address0);
  // const address1 = await signer1.getAddress();

  var initCode = FACTORY_ADDRESS + AccountFactory.interface.encodeFunctionData("createAccount", [address0]).slice(2);  // its for initial account deployment
  
  var sender ;
  try {
    await EPoint.getSenderAddress(initCode);
  }
  catch(Ex)
  {
    console.log(Ex.data);
    sender  = '0x'+ Ex.data .slice(-40);
  }
  console.log({ sender });

  const codeLength = await hre.ethers.provider.getCode(sender);
  console.log({codeLength});
  if(codeLength != "0x")
  {
    initCode = "0x";
  }
  
  // Use the function from the account
  const Account = await hre.ethers.getContractFactory("Account");



  const userOp = {
    sender,
    nonce: "0x" + (await EPoint.getNonce(sender, 0)) .toString(16),
    initCode,
    callData: Account.interface.encodeFunctionData("execute"),
    paymasterAndData: PAYMASTER_ADDRESS, // we're not using a paymaster, for now
    signature: "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c", // we're not validating a signature, for now
  }

  // Set gas settings
  const {preVerificationGas,callGasLimit,verificationGasLimit} = await ethers.provider.send("eth_estimateUserOperationGas", [
        userOp,
        ENTRYPOINT_ADDRESS,
      ]);
   
    userOp.callGasLimit = callGasLimit;
    userOp.verificationGasLimit = verificationGasLimit;
    userOp.preVerificationGas = preVerificationGas;

  // Set maxFeePerGas and maxPriorityFeePerGas
  const {maxFeePerGas} = await ethers.provider.getFeeData();
    userOp.maxFeePerGas = "0x"+ maxFeePerGas.toString(16);
  
  const maxPriorityFeePerGas = await ethers.provider.send("rundler_maxPriorityFeePerGas");
    userOp.maxPriorityFeePerGas = maxPriorityFeePerGas;
 
    const userOpHash = await EPoint.getUserOpHash(userOp);
    userOp.signature = await signer0.signMessage(hre.ethers.getBytes(userOpHash));
  
  console.log("userOp", userOp);
  const opHash = await ethers.provider.send("eth_sendUserOperation",[
    userOp,
    ENTRYPOINT_ADDRESS,
  ]);

  console.log("opHash", opHash);

  setTimeout(async () => {
    const { transactionHash } = await ethers.provider.send("eth_getUserOperationByHash",[
      opHash
    ]);
    console.log(transactionHash);
  }, 5000);

  // try {
  //   // Sending a transaction using handleOps and waiting for it to be mined
  //   const tx = await EPoint.handleOps([userOp], address1);
  //   const receipt = await tx.wait();
  //   console.log("receipt:", receipt);
  // } catch (error) {
  //   console.error("Error:", error);
  // }
}

// Run the main function and catch any errors
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
