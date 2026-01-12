# Counter API Server

Node.js API server for interacting with the deployed Counter smart contract.

This application is completely separate from the Hardhat contract deployment project. There are no dependencies between the two projects.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file with your configuration:

```env
# RPC URL (required)
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_API_KEY
# Or use generic RPC_URL
RPC_URL=https://sepolia.infura.io/v3/YOUR_API_KEY

# Private key for transactions (required)
SEPOLIA_PRIVATE_KEY=0xYOUR_PRIVATE_KEY
# Or use generic SEPOLIA_PRIVATE_KEY
SEPOLIA_PRIVATE_KEY=0xYOUR_PRIVATE_KEY

# Contract address (required)
CONTRACT_ADDRESS=0xYourDeployedContractAddress

# Network (optional, defaults to "sepolia")
NETWORK=sepolia

# Port (optional, defaults to 3000)
PORT=3000
```

To get the deployed contract address, run in the `hardhat-1` project:

```bash
npx hardhat run scripts/deploy.ts
```

## Running the Server

```bash
# Start the server
npm start

# Or run in development mode with auto-reload
npm run dev
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## API Endpoints

### 1. Get Current Value

**GET** `/value`

Get the current counter value.

**Response:**

```json
{
  "success": true,
  "value": "5"
}
```

### 2. Increment by 1

**POST** `/increment`

Increment the counter by 1.

**Response:**

```json
{
  "success": true,
  "transactionHash": "0x...",
  "blockNumber": "12345678",
  "status": "success"
}
```

### 3. Increment by Amount

**POST** `/increment-by`

Increment the counter by a specified amount.

**Request Body:**

```json
{
  "amount": 10
}
```

**Response:**

```json
{
  "success": true,
  "transactionHash": "0x...",
  "blockNumber": "12345678",
  "status": "success",
  "amount": 10
}
```

### 4. Health Check

**GET** `/health`

Check if the server is running.

**Response:**

```json
{
  "status": "ok"
}
```

## Project Structure

```
counter-api/
├── src/
│   └── server.ts          # Main API server file
├── artifacts/
│   └── Counter.json       # Contract ABI (copy from compiled contract artifacts)
├── package.json
├── tsconfig.json
└── README.md
```

## Notes

- The contract address must be set in the `.env` file using the `CONTRACT_ADDRESS` environment variable.
- The contract ABI is stored in `artifacts/Counter.json` and should be updated whenever the contract is recompiled.
- Make sure to deploy the contract before running the API server and set the `CONTRACT_ADDRESS` in your `.env` file.
