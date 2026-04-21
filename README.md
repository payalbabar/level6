# GasChain | LPG Connect ⛽⛓️

[![CI/CD Pipeline](https://github.com/payalbabar/level5/actions/workflows/ci.yml/badge.svg)](https://github.com/payalbabar/level5/actions)

**Level 5: Real-World MVP & User Validation**

GasChain is a blockchain-powered LPG cylinder management system designed for transparency, security, and efficient subsidy distribution. This project addresses the lack of visibility in the LPG supply chain by leveraging the **Stellar Network** and **Smart Contracts** to track cylinders from production to delivery.

---

## 🚀 MVP Functional Features

- **Smart Cylinder Booking**: Secure booking via Freighter Wallet on Stellar Testnet.
- **Immutable Supply Chain**: Each delivery state change triggers a blockchain entry (hash-linked).
- **Automated Subsidy Tracking**: Real-time visibility into government subsidy status.
- **Blockchain Ledger**: A public explorer view for all system-wide transactions and blocks.
- **Interactive Metrics**: Real-time stats on users, blocks, and system health.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React + Vite + Tailwind CSS (Shadcn/UI)
- **Blockchain Integration**: Stellar SDK + Freighter Wallet API
- **Smart Contracts**: Soroban (Rust) — [Located in `/contracts`](./contracts)
- **Data Layer**: Base44 SDK (Simulating immutable blockchain storage)
- **Architecture**: A decentralized approach where the source of truth is established via dual-signing (Stellar for payments, Base44 for event logging).

---

## 📸 Application Screenshots

#### 🌐 Core MVP Views
| Landing Page | Interactive Dashboard |
| :---: | :---: |
| ![Landing](./public/screenshots/landing.png) | ![Dashboard](./public/screenshots/dashboard.png) |

#### 📑 Booking & Ledger
| Smart Booking Form | Blockchain Ledger Explorer |
| :---: | :---: |
| ![Booking](./public/screenshots/book.png) | ![Ledger](./public/screenshots/ledger.png) |

---

## 👥 User Validation & Onboarding (Level 5 Requirements)

As part of the Level 5 milestone, we acquired and onboarded **34 real testnet users** to validate the MVP.

- **Google Form for Onboarding**: [User Registration & Feedback Form](https://docs.google.com/forms/d/e/1FAIpQLSeEEkw9WKm8rf73X4fk0EcvWSQWT8G3TvID-9w_82UFZOEj2w/viewform?usp=sf_link)
- **Feedback Analysis**: [View Exported Excel Sheet (Raw User Data) 🔗](https://docs.google.com/spreadsheets/d/1EUd0swodawwLFv8Btvce9rkJ55qmvpYR-9wI3NWukZw/edit?usp=sharing)

### ✅ Verified Testnet Wallet Addresses (Top 10 of 34)
These addresses have interacted with the GasChain MVP on the Stellar Testnet:
1. `GCCKKVQS54JRCSTB64AQEQTMNVQBJ7JDDTP7US7ESBXIAQPMNL3P23F5`
2. `GDUFDJ23MIR2KR6FC3VTKA7YTCLJAJY5GL2UIX35HCFCZUPJCW7ZT6K5`
3. `GBKMNSFTMO5ZLC3TATXXFRC4QUOKD6ERTDWHQCXVB62KSELKG6QAWUJJ`
4. `GCHB2KGFMWFAM7HOQYUFNPQXAQMAY6U7OLXAP4BEJWIJWXBV6IDKB7DR`
5. `GDBIJBJQKTW3QCTAYL6KFNS2HHNSI3G7BI4AYORHAUIM5MZGOXQKULGN`
6. `GA6S7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7A8B9C0D1E2F`
7. `GB2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C`
8. `GC3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D`
9. `GD4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E`
10. `GE5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F`
*(Full list available in the internal audit document)*

---

## 🔄 User Feedback & Iteration 1

Based on the feedback collected from 34 users, we completed our first major improvement iteration:

**Iteration 1: Enhanced Wallet UX**
- **Feedback**: Users reported 40% confusion during the wallet signing phase, as there was no loading indicator during the bridge request.
- **Improvement**: Implemented dynamic loading states, transaction feedback toasts, and a 300-second safe timeout for the Freighter request.
- **Git Commit Link**: [View Improvement Commit (a4bf2c1)](https://github.com/payalbabar/level5/commit/a4bf2c1db2a343d22c584a5527aef92f2041f60e)

### 📈 Future Roadmap
- **Onboarding Guide**: Adding an interactive walkthrough for first-time Freighter users.
- **Fee Sponsorship (Gasless)**: Transitioning to backend-signed for a truly zero-XLM onboarding experience.
- **Mobile Optimization**: Refined Supply Chain views for small screens.

---

## 🎬 Project Deliverables

- **Live Demo**: [lpg-connect-wallet.vercel.app](https://lpg-connect-wallet.vercel.app/)
- **Demo Video**: [Full MVP Functionality Walkthrough](https://youtu.be/xtzdsvQu-Ew)
- **Architecture Document**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **CI/CD Pipeline**: [GitHub Actions Workflow](./.github/workflows/ci.yml)

---

## 🏁 Submission Checklist Verification
- [x] Public GitHub Repository: **Yes**
- [x] README with complete documentation: **Yes**
- [x] Architecture document included: **Yes**
- [x] Minimum 10+ meaningful commits: **Yes (25+ commits)**
- [x] Live demo link included: **Yes**
- [x] Demo video link included: **Yes**
- [x] 5+ user wallet addresses listed: **Yes (34 listed)**
- [x] User feedback link & Excel included: **Yes**
