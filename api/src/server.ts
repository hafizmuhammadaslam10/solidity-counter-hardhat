import express from "express";
import cors from "cors";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia, localhost } from "viem/chains";
import * as dotenv from "dotenv";
import CounterArtifact from "../artifacts/Counter.json";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const NETWORK = (process.env.NETWORK || "sepolia").toLowerCase();

// Get contract address from environment variable
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS as
  | `0x${string}`
  | undefined;

if (!CONTRACT_ADDRESS) {
  console.error("Error: CONTRACT_ADDRESS must be set in .env file");
  console.error(`Example: CONTRACT_ADDRESS=0x... npm start`);
  process.exit(1);
}

// Network configuration
const RPC_URL = process.env.SEPOLIA_RPC_URL || process.env.RPC_URL || "";
const SEPOLIA_PRIVATE_KEY =
  process.env.SEPOLIA_PRIVATE_KEY || process.env.SEPOLIA_PRIVATE_KEY || "";
const chain = NETWORK === "localhost" ? localhost : sepolia;

if (!RPC_URL || !SEPOLIA_PRIVATE_KEY) {
  console.error(
    "Error: RPC_URL (or SEPOLIA_RPC_URL) and SEPOLIA_PRIVATE_KEY (or SEPOLIA_PRIVATE_KEY) must be set in .env file"
  );
  process.exit(1);
}

// Create account from private key
const account = privateKeyToAccount(SEPOLIA_PRIVATE_KEY as `0x${string}`);

// Create clients
const publicClient = createPublicClient({
  chain: chain,
  transport: http(RPC_URL),
});

const walletClient = createWalletClient({
  account,
  chain: chain,
  transport: http(RPC_URL),
});

// Get contract ABI
const counterABI = CounterArtifact.abi;

// GET /value - Get current counter value
app.get("/value", async (req, res) => {
  try {
    console.log("CONTRACT_ADDRESS", CONTRACT_ADDRESS);
    const value = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: counterABI,
      functionName: "x",
    });

    res.json({
      success: true,
      value: value.toString(),
    });
  } catch (error: any) {
    console.error("Error reading value:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to read counter value",
    });
  }
});

// POST /increment - Increment counter by 1
app.post("/increment", async (req, res) => {
  console.log("CONTRACT_ADDRESS increment", CONTRACT_ADDRESS);
  try {
    const hash = await walletClient.writeContract({
      address: CONTRACT_ADDRESS,
      abi: counterABI,
      functionName: "inc",
    });

    // Wait for transaction receipt
    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    res.json({
      success: true,
      transactionHash: hash,
      blockNumber: receipt.blockNumber.toString(),
      status: receipt.status,
    });
  } catch (error: any) {
    console.error("Error incrementing:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to increment counter",
    });
  }
});

// POST /increment-by - Increment counter by specified amount
app.post("/increment-by", async (req, res) => {
  try {
    console.log("CONTRACT_ADDRESS increment-by", CONTRACT_ADDRESS);
    const { amount } = req.body;

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Amount must be a positive number",
      });
    }

    const hash = await walletClient.writeContract({
      address: CONTRACT_ADDRESS,
      abi: counterABI,
      functionName: "incBy",
      args: [BigInt(amount)],
    });

    // Wait for transaction receipt
    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    res.json({
      success: true,
      transactionHash: hash,
      blockNumber: receipt.blockNumber.toString(),
      status: receipt.status,
      amount: amount,
    });
  } catch (error: any) {
    console.error("Error incrementing by amount:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to increment counter by amount",
    });
  }
});

// POST /decrement - Decrement counter by 1
app.post("/decrement", async (req, res) => {
  console.log("CONTRACT_ADDRESS decrement", CONTRACT_ADDRESS);
  try {
    const hash = await walletClient.writeContract({
      address: CONTRACT_ADDRESS,
      abi: counterABI,
      functionName: "dec",
    });

    // Wait for transaction receipt
    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    res.json({
      success: true,
      transactionHash: hash,
      blockNumber: receipt.blockNumber.toString(),
      status: receipt.status,
    });
  } catch (error: any) {
    console.error("Error decrementing:", error);
    const errorMessage =
      error.message || error.shortMessage || "Failed to decrement counter";
    // Check for underflow/revert errors
    if (
      errorMessage.includes("cannot be decremented") ||
      errorMessage.includes("underflow")
    ) {
      res.status(400).json({
        success: false,
        error: "Cannot decrement: counter is already at zero",
      });
    } else {
      res.status(500).json({
        success: false,
        error: errorMessage,
      });
    }
  }
});

// POST /decrement-by - Decrement counter by specified amount
app.post("/decrement-by", async (req, res) => {
  try {
    console.log("CONTRACT_ADDRESS decrement-by", CONTRACT_ADDRESS);
    const { amount } = req.body;

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Amount must be a positive number",
      });
    }

    const hash = await walletClient.writeContract({
      address: CONTRACT_ADDRESS,
      abi: counterABI,
      functionName: "decBy",
      args: [BigInt(amount)],
    });

    // Wait for transaction receipt
    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    res.json({
      success: true,
      transactionHash: hash,
      blockNumber: receipt.blockNumber.toString(),
      status: receipt.status,
      amount: amount,
    });
  } catch (error: any) {
    console.error("Error decrementing by amount:", error);
    const errorMessage =
      error.message ||
      error.shortMessage ||
      "Failed to decrement counter by amount";
    // Check for underflow/revert errors
    if (
      errorMessage.includes("cannot be decremented") ||
      errorMessage.includes("underflow")
    ) {
      res.status(400).json({
        success: false,
        error: `Cannot decrement by ${amount}: counter would go below zero`,
      });
    } else {
      res.status(500).json({
        success: false,
        error: errorMessage,
      });
    }
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`📝 Contract Address: ${CONTRACT_ADDRESS}`);
  console.log(`🔗 Network: ${NETWORK}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  GET  /value - Get current counter value`);
  console.log(`  POST /increment - Increment by 1`);
  console.log(`  POST /increment-by - Increment by specified amount`);
  console.log(`  POST /decrement - Decrement by 1`);
  console.log(`  POST /decrement-by - Decrement by specified amount`);
});
