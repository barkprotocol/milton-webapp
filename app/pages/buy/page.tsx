'use client';

import { useState, useCallback, memo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletButton } from '@/components/ui/wallet-button';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, AlertCircle, Info, CheckCircle, DollarSign } from 'lucide-react';
import { BuyMiltonForm } from '@/components/ui/milton/buy-milton-form';
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const yellowIcons = {
  info: <Info className="text-yellow-500 w-6 h-6" />,
  check: <CheckCircle className="text-yellow-500 w-6 h-6" />,
  dollar: <DollarSign className="text-yellow-500 w-6 h-6" />,
};

const MILTON_LOGO_URL = process.env.NEXT_PUBLIC_MILTON_LOGO_URL || 'https://ucarecdn.com/fe802b60-cb87-4adc-8e1d-1b16a05f9420/miltonlogoicon.svg';

const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
];

export default function BuyPage() {
  return (
    <WalletProvider wallets={wallets}>
      <WalletModalProvider>
        <BuyPageContent />
      </WalletModalProvider>
    </WalletProvider>
  );
}

function BuyPageContent() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { publicKey } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [miltonPrice, setMiltonPrice] = useState<number | null>(null);
  const [usdcPrice, setUsdcPrice] = useState<number | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [purchaseDetails, setPurchaseDetails] = useState<{ solAmount: number; miltonAmount: number } | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/milton-price');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setMiltonPrice(data.miltonPrice);
        setUsdcPrice(data.usdcPrice);
      } catch (error) {
        console.error('Failed to fetch prices:', error);
        toast({
          title: "Price Fetch Error",
          description: "Unable to fetch current prices. Please try again later.",
          variant: "destructive",
        });
        setError('Could not fetch prices. Please refresh the page.');
        setMiltonPrice(null);
        setUsdcPrice(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // Refresh price every minute

    return () => clearInterval(interval);
  }, []);

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    console.error('Purchase error:', errorMessage);
    toast({
      title: "Purchase Error",
      description: errorMessage,
      variant: "destructive",
    });
    setIsLoading(false);
  }, []);

  const handlePurchaseIntent = useCallback((solAmount: number, miltonAmount: number) => {
    setPurchaseDetails({ solAmount, miltonAmount });
    setShowConfirmation(true);
  }, []);

  const handleConfirmPurchase = useCallback(async () => {
    if (!purchaseDetails) return;

    setIsLoading(true);
    setShowConfirmation(false);

    try {
      // Implement actual purchase logic here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulating API call
      const mockSignature = 'MOCK_SIGNATURE_' + Date.now();

      toast({
        title: "Purchase Successful",
        description: `You have successfully purchased ${purchaseDetails.miltonAmount.toFixed(2)} MILTON tokens for ${purchaseDetails.solAmount.toFixed(2)} SOL. Transaction signature: ${mockSignature}`,
      });

      router.push('/wallet');
    } catch (error) {
      handleError('Failed to complete the purchase. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [purchaseDetails, handleError, router]);

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
            usdcPrice={usdcPrice}
          />
          <InformationSection />
        </div>
        <OriginSection />
        <SupportSection />
      </div>
      <PurchaseConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmPurchase}
        purchaseDetails={purchaseDetails}
      />
    </main>
  );
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
  );
});

ErrorDisplay.displayName = 'ErrorDisplay';

const PurchaseFormContainer = memo(({ onError, onPurchaseIntent, isWalletConnected, isLoading, miltonPrice, usdcPrice }: { 
  onError: (error: string) => void, 
  onPurchaseIntent: (solAmount: number, miltonAmount: number) => void, 
  isWalletConnected: boolean; 
  isLoading: boolean; 
  miltonPrice: number | null; 
  usdcPrice: number | null; 
}) => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle className="text-center">Purchase MILTON Tokens</CardTitle>
    </CardHeader>
    <CardContent>
      {!isWalletConnected ? (
        <div className="text-center">
          <p className="mb-4">Please connect your wallet to purchase MILTON tokens.</p>
          <WalletButton />
        </div>
      ) : (
        <BuyMiltonForm
          onError={onError}
          onPurchaseIntent={onPurchaseIntent}
          isLoading={isLoading}
          miltonPrice={miltonPrice}
          usdcPrice={usdcPrice}
        />
      )}
    </CardContent>
  </Card>
));

PurchaseFormContainer.displayName = 'PurchaseFormContainer';

const InformationSection = memo(() => (
  <div className="flex flex-col space-y-4">
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Benefits of Purchasing MILTON</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {yellowIcons.info}
        <p className="text-center mt-2">Get exclusive access to features and events.</p>
      </CardContent>
    </Card>
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Unique Use Cases</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {yellowIcons.check}
        <p className="text-center mt-2">Participate in community decisions and governance.</p>
      </CardContent>
    </Card>
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Investment Potential</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {yellowIcons.dollar}
        <p className="text-center mt-2">Invest in a growing ecosystem with real value.</p>
      </CardContent>
    </Card>
  </div>
));

InformationSection.displayName = 'InformationSection';

const OriginSection = memo(() => (
  <div className="my-8">
    <h2 className="text-2xl font-bold text-center">About MILTON</h2>
    <p className="text-center mt-2">MILTON is designed for transparency, community engagement, and value generation.</p>
  </div>
));

OriginSection.displayName = 'OriginSection';

const SupportSection = memo(() => (
  <div className="my-8">
    <h2 className="text-2xl font-bold text-center">Need Support?</h2>
    <p className="text-center mt-2">If you have any questions, feel free to contact our support team.</p>
  </div>
));

SupportSection.displayName = 'SupportSection';

const PurchaseConfirmationDialog = memo(({ isOpen, onClose, onConfirm, purchaseDetails }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
  purchaseDetails: { solAmount: number; miltonAmount: number } | null 
}) => {
  if (!purchaseDetails) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Purchase</DialogTitle>
          <DialogDescription>
            You are about to purchase {purchaseDetails.miltonAmount.toFixed(2)} MILTON tokens for {purchaseDetails.solAmount.toFixed(2)} SOL.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

PurchaseConfirmationDialog.displayName = 'PurchaseConfirmationDialog';