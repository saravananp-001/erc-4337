const hre = require("hardhat");

const sender_mysmartAccount = "0xCafac3dD18aC6c6e92c921884f9E4176737C052c";
const ENTRYPOINT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const FACTORY_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const PAYMASTER_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
async function main() {
  // Deploy the EntryPoint contract
  const Account  = await hre.ethers.getContractAt("Account",sender_mysmartAccount);
  const count = await Account.count();
  console.log("Count:", count);

  const EPoint = await hre.ethers.getContractAt("EntryPoint", ENTRYPOINT_ADDRESS);

  // check the balancess
  console.log("Account Balance:", await hre.ethers.provider.getBalance(sender_mysmartAccount));
  console.log("Deposit Account Balance:", await EPoint.balanceOf(sender_mysmartAccount));
  console.log("Deposit ENTRYPOINT_ADDRESS Balance:", await EPoint.balanceOf(ENTRYPOINT_ADDRESS));
  console.log("Deposit FACTORY_ADDRESS Balance:", await EPoint.balanceOf(FACTORY_ADDRESS));
  console.log("Deposit PAYMASTER_ADDRESS Balance:", await EPoint.balanceOf(PAYMASTER_ADDRESS));
}

// Run the main function and catch any errors
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
