const hre = require("hardhat");

async function main() {
  // Deploy the EntryPoint contract
  const EntryPoint = await hre.ethers.deployContract("EntryPoint");
  
  // Wait for the deployment to complete
  await EntryPoint.waitForDeployment();
  
  // Log the deployed contract address
  console.log("Deployed EntryPoint to:", EntryPoint.target);
}

// Run the main function and catch any errors
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
