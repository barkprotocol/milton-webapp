'use client'

import { useState, useCallback, memo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { WalletProvider, useWallet } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { WalletButton } from '@/components/ui/wallet-button'
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, AlertCircle, Info, Coins, Shield } from 'lucide-react'

// Default logo URL
const MILTON_LOGO_URL = process.env.NEXT_PUBLIC_MILTON_LOGO_URL || 'https://ucarecdn.com/fe802b60-cb87-4adc-8e1d-1b16a05f9420/miltonlogoicon.svg'

// Initialize wallet adapters
const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
  // Add other wallets as needed
];

// Mocked TokenPurchaseForm component
const TokenPurchaseForm = memo(({ setError }: { setError: (error: string | null) => void }) => (
  <div>
    <p>Token Purchase Form Placeholder</p>
    <Button onClick={() => setError('Test error')}>Simulate Error</Button>
  </div>
));

TokenPurchaseForm.displayName = 'TokenPurchaseForm';

export default function BuyPage() {
  return (
    <WalletProvider wallets={wallets}>
      <WalletModalProvider>
        <BuyPageContent />
      </WalletModalProvider>
    </WalletProvider>
  )
}

function BuyPageContent() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const { publicKey } = useWallet()

  const handleError = useCallback((errorMessage: string | null) => {
    setError(errorMessage)
    if (errorMessage) {
      console.error('Purchase error:', errorMessage)
      // Additional error handling logic can be added here
    }
  }, [])

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Header router={router} />
        <ErrorDisplay error={error} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <PurchaseFormContainer setError={handleError} isWalletConnected={!!publicKey} />
          <InformationSection />
        </div>
        <SupportSection />
      </div>
    </main>
  )
}

const Header = memo(({ router }: { router: ReturnType<typeof useRouter> }) => (
  <div className="flex justify-between items-center mb-8">
    <Button
      onClick={() => router.push('/')}
      variant="outline"
      className="flex items-center text-primary hover:bg-primary/10 transition-colors"
      aria-label="Back to Main"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back to Main
    </Button>
    <h1 className="text-3xl font-bold text-center flex items-center">
      <Image
        src={MILTON_LOGO_URL}
        alt="Milton Logo"
        width={40}
        height={40}
        className="mr-2"
      />
      Buy $MILTON
    </h1>
    <WalletButton />
  </div>
));

Header.displayName = 'Header';

const ErrorDisplay = memo(({ error }: { error: string | null }) => {
  if (!error) return null;

  return (
    <Alert variant="destructive" className="mb-6" role="alert">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )
});

ErrorDisplay.displayName = 'ErrorDisplay';

const PurchaseFormContainer = memo(({ setError, isWalletConnected }: { setError: (error: string | null) => void, isWalletConnected: boolean }) => (
  <Card>
    <CardHeader>
      <CardTitle>Purchase MILTON Tokens</CardTitle>
      <CardDescription>Enter the amount of MILTON you want to buy</CardDescription>
    </CardHeader>
    <CardContent>
      {isWalletConnected ? (
        <TokenPurchaseForm setError={setError} />
      ) : (
        <div className="text-center">
          <p className="mb-4">Please connect your wallet to purchase MILTON tokens.</p>
          <WalletButton />
        </div>
      )}
    </CardContent>
  </Card>
));

PurchaseFormContainer.displayName = 'PurchaseFormContainer';

const InformationSection = memo(() => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Info className="mr-2 h-5 w-5" />
          About MILTON Tokens
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          MILTON tokens are the native cryptocurrency of the Milton ecosystem. They can be used for various purposes within our platform, including accessing premium features, participating in governance, and more.
        </p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Coins className="mr-2 h-5 w-5" />
          Token Utility
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside text-sm text-muted-foreground">
          <li>Access to exclusive content and features</li>
          <li>Participation in community governance</li>
          <li>Rewards for platform engagement</li>
          <li>Trading on supported exchanges</li>
        </ul>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="mr-2 h-5 w-5" />
          Security
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Your MILTON tokens are secured on the Solana blockchain. Always ensure you're interacting with official Milton platforms and keep your wallet information safe.
        </p>
      </CardContent>
    </Card>
  </div>
));

InformationSection.displayName = 'InformationSection';

const SupportSection = memo(() => (
  <div className="mt-8 text-center text-sm text-muted-foreground">
    <p>Need help? Contact our support team at</p>
    <a href="mailto:support@miltonprotocol.com" className="text-primary hover:underline">
      support@miltonprotocol.com
    </a>
  </div>
));

SupportSection.displayName = 'SupportSection';