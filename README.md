# Counter App - Blockchain Project

A full-stack blockchain application featuring a Counter smart contract and a REST API server for interacting with it.

## 📁 Project Structure

This repository contains two main components:

### 1. `hardhat/` - Smart Contract Project
A production-ready Hardhat project implementing a Counter smart contract with comprehensive testing and deployment capabilities.

**Key Features:**
- Solidity smart contract with increment/decrement functionality
- Comprehensive test coverage (Solidity + TypeScript)
- Multi-network deployment support (local, Sepolia testnet)
- Hardhat Ignition deployment system

📖 **See [hardhat/README.md](./hardhat/README.md) for detailed documentation**

### 2. `api/` - API Server
A Node.js/Express API server for interacting with the deployed Counter smart contract.

**Key Features:**
- RESTful API endpoints for contract interactions
- TypeScript with Viem for type-safe contract calls
- CORS support for frontend integration
- Environment-based configuration

📖 **See [api/README.md](./api/README.md) for detailed documentation**

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.x
- **npm** or **yarn**
- **Git**

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd counter-app
   ```

2. **Install dependencies for Hardhat project**
   ```bash
   cd hardhat
   npm install
   cd ..
   ```

3. **Install dependencies for API server**
   ```bash
   cd api
   npm install
   cd ..
   ```

4. **Configure environment variables**

   **For Hardhat** (in `hardhat/` directory):
   ```env
   SEPOLIA_RPC_URL=your_sepolia_rpc_url
   SEPOLIA_PRIVATE_KEY=your_private_key
   ```

   **For API** (in `api/` directory):
   ```env
   RPC_URL=your_rpc_url
   SEPOLIA_PRIVATE_KEY=your_private_key
   CONTRACT_ADDRESS=your_deployed_contract_address
   PORT=3000
   ```

## 📖 Usage

### Deploy the Smart Contract

1. Navigate to the hardhat directory:
   ```bash
   cd hardhat
   ```

2. Compile the contracts:
   ```bash
   npm run compile
   ```

3. Deploy to Sepolia testnet:
   ```bash
   npm run deploy
   ```

4. Get the deployed contract address:
   ```bash
   npx hardhat run scripts/deploy.ts
   ```

### Run the API Server

1. Navigate to the api directory:
   ```bash
   cd api
   ```

2. Update the `.env` file with the deployed contract address from step above

3. Start the server:
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

The API will be available at `http://localhost:3000`

## 🧪 Testing

### Test Smart Contracts

```bash
cd hardhat
npm test
```

### Test API Endpoints

Once the API server is running, you can test the endpoints:

- **GET** `http://localhost:3000/health` - Health check
- **GET** `http://localhost:3000/value` - Get current counter value
- **POST** `http://localhost:3000/increment` - Increment by 1
- **POST** `http://localhost:3000/increment-by` - Increment by amount

## 🛠️ Tech Stack

### Smart Contract
- **Solidity** ^0.8.28
- **Hardhat** ^3.1.3
- **TypeScript** ~5.8.0
- **Viem** ^2.44.1
- **Hardhat Ignition** ^3.0.6

### API Server
- **Node.js** with **Express**
- **TypeScript** ~5.8.0
- **Viem** ^2.44.1
- **CORS** support

## 📝 Project Workflow

1. **Develop & Test** smart contracts in `hardhat/`
2. **Deploy** contracts to testnet/mainnet
3. **Configure** API server with contract address
4. **Run** API server to interact with deployed contracts
5. **Integrate** frontend applications with the API

## 🔒 Security Notes

- ⚠️ **Never commit** `.env` files or private keys to version control
- ⚠️ Use testnet for development and testing
- ⚠️ Keep private keys secure and never share them

## 📚 Documentation

- [Hardhat Project Documentation](./hardhat/README.md)
- [API Server Documentation](./api/README.md)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the UNLICENSED license.

---

**Happy Building! 🚀**
