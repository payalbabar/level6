# Architecture Document: DESTATE 🏛️⛓️

## 1. System Overview
DESTATE is a decentralized real estate marketplace built to eliminate intermediaries and provide transparent, immutable property records. By leveraging the **Stellar Network** and **Soroban Smart Contracts**, DESTATE ensures that property listings, sales, and ownership transfers are handled with cryptographic certainty.

---

## 2. Core Components

### 2.1 Frontend (React + Vite)
- **Framework**: React 18 for high-performance reactive UI.
- **Build Tool**: Vite for rapid development and optimized production bundles.
- **Styling**: Tailwind CSS v4 with custom glassmorphism utilities for a premium, modern aesthetic.
- **State Management**: React Context API for managing wallet sessions (`WalletContext`) and persistent UI state.

### 2.2 Blockchain Integration (Stellar + Soroban)
- **Wallet**: `@stellar/freighter-api` handles secure, non-custodial transaction signing.
- **SDK**: `@stellar/stellar-sdk` for building transactions and interacting with the Horizon (events) and Soroban (contracts) endpoints.
- **Smart Contracts**: Written in **Rust (Soroban)**, the contract serves as the source of truth for property status, price, and current ownership. 

### 2.3 Backend & Indexing Layer (Supabase)
- **Role**: High-speed metadata storage and caching layer.
- **Sync Mechanism**: A hybrid approach where the frontend reads from Supabase for fast UI updates, but verifies critical state (ownership) directly against the Stellar ledger.
- **Real-time**: Supabase Webhooks and Listeners are used to sync the database whenever a Soroban event is emitted.

---

## 3. High-Level Workflows

### 3.1 Listing a Property (On-Chain)
1. **Payload Creation**: User fills the listing form; metadata is hashed.
2. **Contract Invocation**: The `register_property` function is called on the Soroban contract.
3. **Immutability**: The property ID, owner, and metadata hash are written to the Stellar ledger forever.

### 3.2 Atomic Property Purchase
1. **Transaction Build**: The app prepares a transaction containing the XLM payment to the seller and the `buy_property` contract call.
2. **Wallet Signature**: User signs via Freighter.
3. **Atomic Execution**: Either both the payment and ownership transfer succeed, or both fail, ensuring no one is cheated.

### 3.3 Metrics Tracking & Analytics
1. **Data Aggregation**: The system tracks `transactions` and `wallet_connections`.
2. **Dashboard**: Metrics are computed in real-time, displaying DAU (Daily Active Users) and Total Value Locked (TVL) in property listings.

---

## 4. Security & Performance
- **Non-Custodial Design**: Private keys never leave the user's browser.
- **Fee Sponsorship**: Uses Stellar's Fee Bump transactions to sponsor network costs for users, improving onboarding UX.
- **Sanitized Inputs**: All property metadata is sanitized before being indexed to prevent injection attacks.
- **Indexing Consistency**: The system uses a "Verification Loop" to ensure Supabase data matches the on-chain Soroban state.

---

## 5. CI/CD & Deployment
- **Pipeline**: Automated via **GitHub Actions**.
- **Deployment**: Hosted on **Vercel** with automatic branch previews and environment variable management.
- **Contract Build**: Uses a custom CI step to compile Rust contracts to WASM and run integration tests.

---

MIT © 2026 DESTATE
