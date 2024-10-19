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
import { MiltonTooltip } from "@/components/ui/milton/milton-tooltip";
import { TooltipProvider } from '@/components/ui/tooltip';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { BuyMiltonForm } from '@/components/ui/milton/buy-milton-form';
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

const MILTON_LOGO_URL = process.env.NEXT_PUBLIC_MILTON_LOGO_URL || 'https://ucarecdn.com/fe802b60-cb87-4adc-8e1d-1b16a05f9420/miltonlogoicon.svg';

const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
];

export default function BuyPage() {
  return (
    <WalletProvider wallets={wallets}>
      <WalletModalProvider>
        <TooltipProvider>
          <BuyPageContent />
        </TooltipProvider>
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

  const handleRetryFetchPrices = () => {
    setError(null);
    fetchPrices();
  };

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Header router={router} />
        <ErrorDisplay error={error} onRetry={handleRetryFetchPrices} />
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Purchase MILTON Tokens <MiltonTooltip content="Use MILTON tokens to unlock exclusive features, receive rewards, and participate in governance decisions." /></CardTitle>
            </CardHeader>
            <CardContent>
              {!publicKey ? (
                <div className="text-center">
                  <p>Please connect your wallet to purchase MILTON tokens.</p>
                  <WalletButton />
                </div>
              ) : (
                <BuyMiltonForm
                  onError={handleError}
                  onPurchaseIntent={handlePurchaseIntent}
                  isLoading={isLoading}
                  miltonPrice={miltonPrice}
                  usdcPrice={usdcPrice}
                />
              )}
            </CardContent>
          </Card>
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
  );
}

const Header = memo(({ router }: { router: ReturnType<typeof useRouter> }) => (
  <div className="flex justify-between items-center mb-8">
    <Button
      onClick={() => router.push('/')}
      variant="outline"
      className="text-primary hover:bg-primary/10 transition-colors"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back to Main
    </Button>
    <h1 className="text-3xl font-bold text-center">
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

const ErrorDisplay = memo(({ error, onRetry }: { error: string | null; onRetry: () => void }) => {
  if (!error) return null;
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {error}
        <Button variant="link" onClick={onRetry}>Retry</Button>
      </AlertDescription>
    </Alert>
  );
});

const SupportSection = memo(() => (
  <div className="mt-8">
    <p>If you have any issues, please contact support.</p>
  </div>
));

const PurchaseConfirmationDialog = memo(({ isOpen, onClose, onConfirm, purchaseDetails }: any) => {
  if (!isOpen || !purchaseDetails) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Purchase</DialogTitle>
          <DialogDescription>You're about to purchase {purchaseDetails.miltonAmount} MILTON tokens for {purchaseDetails.solAmount} SOL.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">Cancel</Button>
          <Button onClick={onConfirm} variant="primary">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
