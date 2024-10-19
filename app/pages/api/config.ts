import { Cluster, Commitment } from '@solana/web3.js';

// Solana configuration
export const SOLANA_CONFIG = {
  cluster: 'devnet' as Cluster,
  rpcEndpoint: 'https://api.devnet.solana.com',
  commitment: 'confirmed' as Commitment,
};

// Milton token configuration
export const MILTON_TOKEN_CONFIG = {
  mintAddress: '4DsZctdxSVNLGYB5YtY8A8JDg6tUoSZnQHSamXecKWWf' as const,
  decimals: 9,
  symbol: 'MILT' as const,
};

// SPL Token configuration
export const SPL_TOKEN_CONFIG = {
  usdcMintAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' as const,
  wrappedSolMintAddress: 'So11111111111111111111111111111111111111112' as const,
};

// Governance configuration (using Solana Realms)
export const GOVERNANCE_CONFIG = {
  programId: 'GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw' as const,
  realmAddress: '4DsZctdxSVNLGYB5YtY8A8JDg6tUoSZnQHSamXecKWWf' as const,
};

// Milton API configuration
export const MILTON_API_CONFIG = {
  baseUrl: 'https://api.demo.miltonprotocol.com' as const,
  version: 'v1' as const,
  defaultHeaders: {
    'Content-Type': 'application/json',
    'X-Milton-API-Key': process.env.MILTON_DEMO_API_KEY || '',
  },
};

// Transaction fee configuration
export const FEE_CONFIG = {
  transactionFee: 5000,
};

// Timeouts and limits
export const TIMEOUTS_AND_LIMITS = {
  transactionTimeout: 30000,
  maxRetries: 3,
  retryDelay: 1000,
};

// Export all configurations as a single object
export const CONFIG = {
  SOLANA: SOLANA_CONFIG,
  MILTON_TOKEN: MILTON_TOKEN_CONFIG,
  SPL_TOKEN: SPL_TOKEN_CONFIG,
  GOVERNANCE: GOVERNANCE_CONFIG,
  MILTON_API: MILTON_API_CONFIG,
  FEES: FEE_CONFIG,
  TIMEOUTS_AND_LIMITS,
} as const;

// Type for the entire configuration
export type MiltonConfig = typeof CONFIG;