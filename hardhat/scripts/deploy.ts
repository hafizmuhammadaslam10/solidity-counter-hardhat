import { readFileSync, writeFileSync, existsSync, readdirSync } from "fs";
import { resolve } from "path";

async function main() {
  console.log(`\n📋 Listing deployed contract addresses...\n`);

  // Find all deployment directories and extract addresses
  const deploymentsDir = resolve(__dirname, "../ignition/deployments");
  
  if (!existsSync(deploymentsDir)) {
    console.error("❌ Ignition deployments directory not found.");
    console.error("Please deploy the contract first using:");
    console.error("  npx hardhat ignition deploy ignition/modules/Counter.ts --network sepolia");
    process.exit(1);
  }

  // Map chain IDs to network names
  const chainIdToNetwork: { [key: number]: string } = {
    11155111: "sepolia",
    31337: "localhost",
    1: "mainnet",
  };

  // Scan deployment directories
  const deploymentDirs = readdirSync(deploymentsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && dirent.name.startsWith("chain-"))
    .map(dirent => dirent.name);

  const deployments: { network: string; address: string; chainId: number }[] = [];

  for (const dir of deploymentDirs) {
    const chainId = parseInt(dir.replace("chain-", ""));
    const networkName = chainIdToNetwork[chainId] || `chain-${chainId}`;
    const deployedAddressesPath = resolve(deploymentsDir, dir, "deployed_addresses.json");

    try {
      if (existsSync(deployedAddressesPath)) {
        const deployedAddresses = JSON.parse(readFileSync(deployedAddressesPath, "utf-8"));
        const address = deployedAddresses["CounterModule#Counter"];
        
        if (address) {
          deployments.push({ network: networkName, address, chainId });
        }
      }
    } catch (error) {
      console.warn(`⚠️  Warning: Could not read deployment for ${networkName}`);
    }
  }

  if (deployments.length === 0) {
    console.error("❌ No deployed contracts found.");
    console.error("Please deploy the contract first using:");
    console.error("  npx hardhat ignition deploy ignition/modules/Counter.ts --network sepolia");
    process.exit(1);
  }

  // Output deployment addresses
  console.log("✅ Deployed Contract Addresses:\n");
  for (const deployment of deployments) {
    console.log(`  Network: ${deployment.network} (Chain ID: ${deployment.chainId})`);
    console.log(`  Address: ${deployment.address}\n`);
  }

  // Write to a local deployments file (optional, for reference)
  const deploymentsFile = resolve(__dirname, "../deployments.json");
  const deploymentsData = {
    counter: deployments.reduce((acc, dep) => {
      acc[dep.network] = dep.address;
      return acc;
    }, {} as Record<string, string>),
  };
  writeFileSync(deploymentsFile, JSON.stringify(deploymentsData, null, 2));
  console.log(`📝 Deployment addresses saved to: ${deploymentsFile}`);
  console.log(`\n💡 Tip: Use these addresses to configure your API application.\n`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
