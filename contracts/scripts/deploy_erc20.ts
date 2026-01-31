import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with", deployer.address);

  const idrx = await ethers.deployContract("MockIDRX");
  await idrx.waitForDeployment();
  const idrxAddr = await idrx.getAddress();
  console.log("MockIDRX deployed at:", idrxAddr);

  // Mint initial supply to deployer for demo/testing
  const mintTx = await idrx.mint(deployer.address, ethers.parseUnits("1000000", 18));
  await mintTx.wait();
  console.log("Minted test IDRX to deployer.");

  const factory = await ethers.deployContract("EscrowERC20Factory");
  await factory.waitForDeployment();
  const factoryAddr = await factory.getAddress();
  console.log("EscrowERC20Factory deployed at:", factoryAddr);

  // Append addresses to frontend .env.local
  const rootEnvPath = path.resolve(__dirname, "../../.env.local");
  const lines = [
    `NEXT_PUBLIC_IDRX_ADDRESS=${idrxAddr}`,
    `NEXT_PUBLIC_ESCROW_FACTORY_ERC20=${factoryAddr}`,
  ];
  try {
    const toAppend = lines.join("\n") + "\n";
    fs.appendFileSync(rootEnvPath, toAppend);
    console.log("Appended ERC20 env to", rootEnvPath);
  } catch (e) {
    console.warn("Could not write .env.local:", (e as Error).message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});