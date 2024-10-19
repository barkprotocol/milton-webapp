# Milton Webapp

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Frameworks and Technologies](#frameworks-and-technologies)
- [Web3 UI/UX](#web3-uiux)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Milton Webapp is a cutting-edge Web3 application built on the Solana blockchain. It provides a seamless and intuitive interface for users to interact with various blockchain functionalities, including token transfers, governance, and more. This README provides an overview of the project, its features, and guidelines for development and usage.

## Features

- **Token Transfers**: Send and receive USDC, SOL, MILTON, and SPL tokens.
- **Blinks**: Create and retrieve instant messages on the blockchain.
- **Governance**: Participate in decentralized decision-making using Solana Realms.
- **Payments**: Process payments on the Milton platform.
- **Donations**: Manage charitable donations with optional anonymity.
- **Gifts**: Send and schedule token gifts to other users.
- **Data Management**: Utilize Supabase for efficient data storage and retrieval.
- **Real-time Updates**: Implement real-time features using Supabase's real-time subscriptions.
- **User Authentication**: Leverage Supabase Auth for secure user management.
- **Works across the entire [Next.js](https://nextjs.org) stack**:
  - App Router
  - Pages Router
  - Middleware
  - Client
  - Server

## Demo

You can view a fully working demo at demo-miltonprotocol.vercel.app.

## Frameworks and Technologies

Milton Webapp leverages a powerful stack of modern frameworks and technologies:

1. **Next.js**: 
   - Version: 14.x
   - Features utilized:
     - App Router for efficient routing
     - Server-side rendering for improved performance
     - API routes for backend functionality
     - Middleware for request processing

2. **React**: 
   - Version: 18.x
   - Used for building interactive user interfaces

3. **Solana Web3.js**:
   - For interacting with the Solana blockchain

4. **Supabase**:
   - Version: Latest stable release
   - Used for:
     - Database management
     - Real-time subscriptions
     - User authentication
     - File storage

5. **TypeScript**:
   - For type-safe development

6. **Tailwind CSS**:
   - For responsive and customizable styling

7. **shadcn/ui**:
   - For pre-built, customizable UI components

8. **Lucide React**:
   - For a comprehensive icon set

9. **Zod**:
   - For data validation

10. **SWR**:
    - For data fetching and caching

11. **Jest** and **React Testing Library**:
    - For unit and integration testing

12. **Cypress**:
    - For end-to-end testing

13. **ESLint** and **Prettier**:
    - For code linting and formatting

## Web3 UI/UX

Milton Webapp prioritizes an exceptional Web3 user experience through the following design principles and features:

1. **Seamless Wallet Integration**: 
   - Easy connection with popular Solana wallets (Phantom, Solflare, etc.).
   - Clear display of connected wallet address and balance.

2. **Transaction Transparency**:
   - Real-time transaction status updates.
   - Detailed transaction history with filtering options.

3. **Gas Fee Optimization**:
   - Clear display of estimated gas fees before transaction confirmation.
   - Option to adjust transaction priority.

4. **Progressive Decentralization**:
   - Gradual introduction of Web3 concepts to new users.
   - Optional custodial features for beginners with a clear path to self-custody.

5. **Responsive Design**:
   - Optimized for both desktop and mobile devices.
   - Consistent experience across different screen sizes.

6. **Error Handling and Recovery**:
   - Clear error messages with suggested actions.
   - Ability to retry failed transactions without starting over.

7. **Governance Participation**:
   - Intuitive interface for viewing and creating proposals.
   - Easy-to-understand voting mechanism.

8. **Token Management**:
   - Unified interface for managing different token types (USDC, SOL, MILTON, SPL).
   - Quick access to token swap functionality.

9. **Security Features**:
   - Optional two-factor authentication for high-value transactions.
   - Clear warnings for irreversible actions.

10. **Customizable User Experience**:
    - Theme options (light/dark mode).
    - Customizable dashboard with favorite features.

11. **Real-time Updates**:
    - Live data updates using Supabase real-time subscriptions.
    - Instant notifications for important events.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Solana CLI tools
- A Solana wallet (e.g., Phantom, Solflare)
- Supabase account and project

### Installation

1. Clone the repository:

```bash
git clone https://github.com/barkprotocol/milton-webapp.git
```

2. Navigate to the project directory:

```bash
cd milton-webapp
```

3. Install the necessary dependencies:

```bash
npm install
# or
yarn install
```

4. Set up the environment variables by creating a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Update the environment variables with your own credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_MINT_API_URL=https://api.actions.miltonprotocol.com/mint
```

5. Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application should now be running on `http://localhost:3000`.

## Usage

Once your environment is set up and running, you can interact with the following features:

- **Wallet Connection**: Connect your Solana wallet.
- **Token Transfers**: Send and receive tokens using the interface.
- **Blinks**: Create blockchain-based messages and view existing ones.
- **Governance**: Participate in proposals using the Governance tab.
- **Payments and Donations**: Process payments and charitable donations using the platform.

### Testing

To run tests, use the following commands:

```bash
npm run test
# or
yarn test
```

To run Cypress end-to-end tests:

```bash
npm run cypress
# or
yarn cypress
```

## API Documentation

Milton Webapp integrates several APIs, including the Solana RPC API, Supabase API, and custom Milton APIs.

- **Token API**: For transferring tokens, minting new tokens, and checking balances.
- **Governance API**: To participate in decentralized governance using Solana Realms.
- **Supabase**: For user authentication, file storage, and real-time updates.

Check the `/api` folder in the project for more details on specific endpoints.

## Contributing

We welcome contributions to the Milton Protocol Webapp. To contribute, please follow these steps:

1. Fork the repository.
2. Create a new feature branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Create a pull request.

Please make sure to update tests as appropriate.

## License

This project is licensed under the MIT License. See the LICENSE file for details.