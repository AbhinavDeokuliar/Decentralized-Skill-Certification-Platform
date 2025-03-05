# Decentralized Skill Certification

A blockchain-based system for issuing and verifying skill certifications.

## Prerequisites

- Node.js (v14+ recommended)
- npm or yarn

## Setup

1. Install dependencies:
```bash
npm install
```

2. Compile the contract:
```bash
npx hardhat compile
```

3. Run tests:
```bash
npx hardhat test
```

4. Deploy locally:
```bash
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

## Project Structure

- `contracts/`: Smart contract source files
- `scripts/`: Deployment and interaction scripts
- `test/`: Test files
