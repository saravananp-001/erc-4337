const hre = require("hardhat");

const ENTRYPOINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const PAYMASTER_ADDRESS = "0x41931204Cdcd6Ed02A66c5285ab62889B3d3688b";

async function main() {

    const EPoint = await hre.ethers.getContractAt("EntryPoint", ENTRYPOINT_ADDRESS);

    //  Deposite the initial payment to paymasters
    await EPoint.depositTo(PAYMASTER_ADDRESS, {
    value: hre.ethers.parseUnits("0.2", "ether") // Ensure this is a hex string
  })

  console.log('ETH deposited');
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});