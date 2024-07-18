const hre = require("hardhat");

const sender_mysmartAccount = "0x29403ae0a7d2d04d06ffdf87a4943537ce309195";
const ENTRYPOINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const FACTORY_ADDRESS = "0x5C119453c85f2318033390Bd4D05DBA7106B4E9f";
const PAYMASTER_ADDRESS = "0x41931204Cdcd6Ed02A66c5285ab62889B3d3688b";
async function main() {

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
