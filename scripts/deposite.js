const hre = require("hardhat");

const ENTRYPOINT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const PAYMASTER_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

async function main() {

    const EPoint = await hre.ethers.getContractAt("EntryPoint", ENTRYPOINT_ADDRESS);

    //  Deposite the initial payment to paymasters
    await EPoint.depositTo(PAYMASTER_ADDRESS, {
    value: hre.ethers.parseUnits("2", "ether") // Ensure this is a hex string
  })

  console.log('ETH deposited');
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});