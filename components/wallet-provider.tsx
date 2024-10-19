'use client';

import { FC, ReactNode, useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletProviderProps {
  children: ReactNode;
  network?: WalletAdapterNetwork;
}

// WalletProviderWrapper component to provide Solana wallet context
export const WalletProviderWrapper: FC<WalletProviderProps> = ({ children, network = WalletAdapterNetwork.Devnet }) => {
  // Custom RPC endpoint based on the selected network
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Define available wallets
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      // Add other wallet adapters here if needed
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};

// Exporting as default export for easier imports
export default WalletProviderWrapper;
