import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import MiltonTooltip from "@/components/ui/milton/milton-tooltip";
import { Loader } from 'lucide-react';

interface PurchaseMiltonProps {
  onError: (error: string) => void;
  onPurchaseIntent: (solAmount: number, miltonAmount: number) => void;
  isLoading: boolean;
  miltonPrice: number | null;
  usdcPrice: number | null;
  connected: boolean; // prop to check if the wallet is connected
  maxSolAmount: number; // Add a prop for maximum SOL amount
}

const PurchaseMilton = ({ onError, onPurchaseIntent, isLoading, miltonPrice, usdcPrice, connected, maxSolAmount }: PurchaseMiltonProps) => {
  const [solAmount, setSolAmount] = useState<number>(0);
  const [miltonAmount, setMiltonAmount] = useState<number>(0);

  useEffect(() => {
    if (miltonPrice) {
      setMiltonAmount(solAmount / miltonPrice);
    }
  }, [solAmount, miltonPrice]);

  const handlePurchase = () => {
    if (solAmount <= 0) {
      onError('Please enter a valid amount greater than zero.');
      return;
    }
    if (solAmount > maxSolAmount) {
      onError(`You can only spend up to ${maxSolAmount} SOL.`);
      return;
    }
    if (!connected) {
      onError('Please connect your wallet before purchasing.');
      return;
    }
    onPurchaseIntent(solAmount, miltonAmount);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= maxSolAmount) {
      setSolAmount(value);
    } else {
      setSolAmount(0);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <MiltonTooltip text="Enter the amount of SOL you wish to spend. The more you spend, the more MILTON tokens you can purchase!">
        <input
          type="number"
          value={solAmount}
          onChange={handleInputChange}
          placeholder="Enter amount in SOL"
          className="border border-yellow-400 rounded p-2 w-full mb-4 text-lg placeholder:text-gray-500 focus:ring focus:ring-yellow-300 transition duration-200"
        />
      </MiltonTooltip>
      <p className="mb-4 text-center text-lg">
        You will receive approximately <span className="font-bold">{miltonAmount.toFixed(2)} MILTON</span> tokens.
      </p>
      <MiltonTooltip text="Click to purchase MILTON tokens. Ensure you have enough SOL in your wallet.">
        <Button
          onClick={handlePurchase}
          disabled={isLoading || !connected}
          className="flex items-center justify-center w-full space-x-2"
        >
          {isLoading ? (
            <>
              <Loader className="animate-spin h-4 w-4 text-yellow-500" />
              <span>Processing...</span>
            </>
          ) : (
            <span>Purchase MILTON Tokens</span>
          )}
        </Button>
      </MiltonTooltip>
      {!connected && <p className="text-red-500 mt-2">Wallet not connected. Please connect your wallet.</p>}
    </div>
  );
};

export default PurchaseMilton;
