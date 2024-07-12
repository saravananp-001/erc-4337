const hre = require("hardhat");

const sender_mysmartAccount = "0xCafac3dD18aC6c6e92c921884f9E4176737C052c";

async function main() {
  // Deploy the EntryPoint contract
  const Account  = await hre.ethers.getContractAt("Account",sender_mysmartAccount);
  const count = await Account.count();
  console.log("Count:", count);
}

// Run the main function and catch any errors
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
