const hre = require("hardhat");

async function main() {
  // Deploy the AccountFactory contract
  const AccountFactory = await hre.ethers.deployContract("AccountFactory");
  
  // Wait for the deployment to complete
  await AccountFactory.waitForDeployment();
  
  // Log the deployed contract address
  console.log("Deployed AccountFactory to:", AccountFactory.target);
}

// Run the main function and catch any errors
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
