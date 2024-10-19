'use client'

import { useState, useCallback, memo, useEffect } from 'react'
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
import { ArrowLeft, AlertCircle, Info, Coins, Shield, TrendingUp } from 'lucide-react'
import { BuyMiltonForm } from '@/components/BuyMiltonForm'
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

// Default logo URL
const MILTON_LOGO_URL = process.env.NEXT_PUBLIC_MILTON_LOGO_URL || 'https://ucarecdn.com/fe802b60-cb87-4adc-8e1d-1b16a05f9420/miltonlogoicon.svg'

// Initialize wallet adapters
const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
]

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
  const [isLoading, setIsLoading] = useState(false)
  const [miltonPrice, setMiltonPrice] = useState<number | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [purchaseDetails, setPurchaseDetails] = useState<{ solAmount: number, miltonAmount: number } | null>(null)

  useEffect(() => {
    const fetchMiltonPrice = async () => {
      try {
        const response = await fetch('/api/milton-price')
        const data = await response.json()
        setMiltonPrice(data.price)
      } catch (error) {
        console.error('Failed to fetch MILTON price:', error)
        toast({
          title: "Price Fetch Error",
          description: "Unable to fetch current MILTON price. Please try again later.",
          variant: "destructive",
        })
      }
    }

    fetchMiltonPrice()
    const interval = setInterval(fetchMiltonPrice, 60000) // Refresh price every minute

    return () => clearInterval(interval)
  }, [])

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage)
    console.error('Purchase error:', errorMessage)
    toast({
      title: "Purchase Error",
      description: errorMessage,
      variant: "destructive",
    })
    setIsLoading(false)
  }, [])

  const handlePurchaseIntent = useCallback((solAmount: number, miltonAmount: number) => {
    setPurchaseDetails({ solAmount, miltonAmount })
    setShowConfirmation(true)
  }, [])

  const handleConfirmPurchase = useCallback(async () => {
    if (!purchaseDetails) return

    setIsLoading(true)
    setShowConfirmation(false)

    try {
      // Implement actual purchase logic here
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulating API call
      const mockSignature = 'MOCK_SIGNATURE_' + Date.now()

      toast({
        title: "Purchase Successful",
        description: `You have successfully purchased ${purchaseDetails.miltonAmount} MILTON tokens for ${purchaseDetails.solAmount} SOL. Transaction signature: ${mockSignature}`,
      })

      router.push('/wallet')
    } catch (error) {
      handleError('Failed to complete the purchase. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [purchaseDetails, handleError, router])

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Header router={router} />
        <ErrorDisplay error={error} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <PurchaseFormContainer 
            onError={handleError} 
            onPurchaseIntent={handlePurchaseIntent}
            isWalletConnected={!!publicKey} 
            isLoading={isLoading}
            miltonPrice={miltonPrice}
          />
          <InformationSection miltonPrice={miltonPrice} />
        </div>
        <SupportSection />
      </div>
      <PurchaseConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmPurchase}
        purchaseDetails={purchaseDetails}
      />
    </main>
  )
}

const Header = memo(({ router }: { router: ReturnType<typeof useRouter> }) => (
  <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
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
))

Header.displayName = 'Header'

const ErrorDisplay = memo(({ error }: { error: string | null }) => {
  if (!error) return null

  return (
    <Alert variant="destructive" className="mb-6" role="alert">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )
})

ErrorDisplay.displayName = 'ErrorDisplay'

const PurchaseFormContainer = memo(({ onError, onPurchaseIntent, isWalletConnected, isLoading, miltonPrice }: { 
  onError: (error: string) => void, 
  onPurchaseIntent: (solAmount: number, miltonAmount: number) => void,
  isWalletConnected: boolean,
  isLoading: boolean,
  miltonPrice: number | null
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Purchase MILTON Tokens</CardTitle>
      <CardDescription>Enter the amount of SOL you want to spend</CardDescription>
    </CardHeader>
    <CardContent>
      {isWalletConnected ? (
        <BuyMiltonForm onError={onError} onPurchaseIntent={onPurchaseIntent} isLoading={isLoading} miltonPrice={miltonPrice} />
      ) : (
        <div className="text-center">
          <p className="mb-4">Please connect your wallet to purchase MILTON tokens.</p>
          <WalletButton />
        </div>
      )}
    </CardContent>
  </Card>
))

PurchaseFormContainer.displayName = 'PurchaseFormContainer'

const InformationSection = memo(({ miltonPrice }: { miltonPrice: number | null }) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="mr-2 h-5 w-5" />
          MILTON Price
        </CardTitle>
      </CardHeader>
      <CardContent>
        {miltonPrice ? (
          <p className="text-2xl font-bold">{miltonPrice.toFixed(4)} SOL</p>
        ) : (
          <Skeleton className="h-8 w-24" />
        )}
        <p className="text-sm text-muted-foreground mt-2">
          Price updates every minute. Last updated: {new Date().toLocaleTimeString()}
        </p>
      </CardContent>
    </Card>
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
))

InformationSection.displayName = 'InformationSection'

const SupportSection = memo(() => (
  <div className="mt-8 text-center text-sm text-muted-foreground">
    <p>Need help? Contact our support team at</p>
    <a href="mailto:support@miltonprotocol.com" className="text-primary hover:underline">
      support@miltonprotocol.com
    </a>
  </div>
))

SupportSection.displayName = 'SupportSection'

const PurchaseConfirmationDialog = memo(({ isOpen, onClose, onConfirm, purchaseDetails }: {
  isOpen: boolean,
  onClose: () => void,
  onConfirm: () => void,
  purchaseDetails: { solAmount: number, miltonAmount: number } | null
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirm Your Purchase</DialogTitle>
        <DialogDescription>
          Please review the details of your MILTON token purchase.
        </DialogDescription>
      </DialogHeader>
      {purchaseDetails && (
        <div className="py-4">
          <p>You are about to purchase:</p>
          <p className="font-bold">{purchaseDetails.miltonAmount} MILTON</p>
          <p>For the price of:</p>
          <p className="font-bold">{purchaseDetails.solAmount} SOL</p>
        </div>
      )}
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm}>Confirm Purchase</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
))

PurchaseConfirmationDialog.displayName = 'PurchaseConfirmationDialog'