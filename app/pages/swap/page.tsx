'use client';

import { useState, useEffect, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { createJupiterApiClient, RouteInfo, TOKEN_LIST_URL } from '@jup-ag/api';
import { TokenInfo } from '@solana/spl-token-registry';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowDownUp } from 'lucide-react';
import Image from 'next/image';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const SOLANA_RPC_ENDPOINT = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
const config = { basePath: 'https://swap.miltonprotocol.com' };
const jupiterQuoteApi = createJupiterApiClient(config);

const SUPPORTED_TOKENS = ['SOL', 'MILTON', 'USDC'];
const CURRENCY_ICONS = {
  SOL: 'https://ucarecdn.com/8bcc4664-01b2-4a88-85bc-9ebce234f08b/sol.png',
  MILTON: 'https://ucarecdn.com/fe802b60-cb87-4adc-8e1d-1b16a05f9420/miltonlogoicon.svg',
  USDC: 'https://ucarecdn.com/67e17a97-f3bd-46c0-8627-e13b8b939d26/usdc.png',
};

const useTokenData = () => {
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch(TOKEN_LIST_URL['mainnet-beta']);
        if (!response.ok) throw new Error('Failed to fetch token list');
        const tokenList = await response.json();
        const filteredTokens = tokenList.filter((token: TokenInfo) => SUPPORTED_TOKENS.includes(token.symbol));
        setTokens(filteredTokens);
      } catch (error) {
        console.error('Error fetching token list:', error);
        setError('Failed to load supported tokens. Please try again later.');
      }
    };
    fetchTokens();
  }, []);

  return { tokens, error };
};

export default function SwapPage() {
  const { publicKey, signTransaction } = useWallet();
  const { tokens, error: tokenError } = useTokenData();
  
  const [inputAmount, setInputAmount] = useState<number>(0);
  const [routes, setRoutes] = useState<RouteInfo[]>([]);
  const [slippage, setSlippage] = useState<number>(1);
  const [selectedRoute, setSelectedRoute] = useState<RouteInfo | null>(null);
  const [inputToken, setInputToken] = useState<string>('SOL');
  const [outputToken, setOutputToken] = useState<string>('MILTON');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const connection = useMemo(() => new Connection(SOLANA_RPC_ENDPOINT), []);

  const getTokenInfo = (symbol: string) => tokens.find((t) => t.symbol === symbol);
  const getTokenMint = (symbol: string) => {
    const token = getTokenInfo(symbol);
    return token ? new PublicKey(token.address) : null;
  };

  const handleSwap = async () => {
    if (!publicKey || !signTransaction || !selectedRoute) {
      setError('Please connect your wallet and select a route before swapping.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { swapTransaction } = await jupiterQuoteApi.swapPost({
        route: selectedRoute,
        userPublicKey: publicKey.toBase58(),
        wrapUnwrapSOL: true,
      });

      const transaction = Transaction.from(Buffer.from(swapTransaction, 'base64'));
      const signedTransaction = await signTransaction(transaction);
      const rawTransaction = signedTransaction.serialize();

      const txid = await connection.sendRawTransaction(rawTransaction, { skipPreflight: true, maxRetries: 2 });
      await connection.confirmTransaction(txid, 'confirmed');

      toast({
        title: 'Swap Successful',
        description: `Successfully swapped ${inputAmount} ${inputToken} for ${(selectedRoute.outAmount / 10 ** 9).toFixed(6)} ${outputToken}`,
      });
    } catch (error) {
      console.error('Error during swap:', error);
      setError('An error occurred while processing the swap. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetRoutes = async () => {
    if (!publicKey) {
      setError('Please connect your wallet to get swap routes.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const inputMint = getTokenMint(inputToken);
      const outputMint = getTokenMint(outputToken);

      if (!inputMint || !outputMint) {
        throw new Error('Invalid input or output token');
      }

      const routesResponse = await jupiterQuoteApi.quoteGet({
        inputMint: inputMint.toBase58(),
        outputMint: outputMint.toBase58(),
        amount: (inputAmount * 10 ** 9).toString(), // Convert to lamports
        slippageBps: slippage * 100,
      });

      setRoutes(routesResponse.data);
      setSelectedRoute(routesResponse.data[0]);
    } catch (error) {
      console.error('Error fetching routes:', error);
      setError('Failed to fetch swap routes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const TokenSelect = ({ value, onChange, label }: { value: string; onChange: (value: string) => void; label: string }) => (
    <div className="space-y-2">
      <Label htmlFor={label}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={label} className="w-full">
          <SelectValue placeholder="Select token" />
        </SelectTrigger>
        <SelectContent>
          {tokens.map((token) => (
            <SelectItem key={token.address} value={token.symbol}>
              <div className="flex items-center">
                <Image
                  src={CURRENCY_ICONS[token.symbol as keyof typeof CURRENCY_ICONS] || CURRENCY_ICONS.SOL}
                  alt={token.symbol}
                  width={24}
                  height={24}
                  className="mr-2 rounded-full"
                />
                {token.symbol}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Swap Tokens</CardTitle>
          <CardDescription>
            Easily swap between SOL, MILTON, and USDC using Jupiter's liquidity aggregator for the best rates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <TokenSelect value={inputToken} onChange={setInputToken} label="From" />
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setInputToken(outputToken);
                  setOutputToken(inputToken);
                }}
                aria-label="Switch tokens"
              >
                <ArrowDownUp className="h-4 w-4" />
              </Button>
            </div>
            <TokenSelect value={outputToken} onChange={setOutputToken} label="To" />
            <Input
              type="number"
              value={inputAmount}
              onChange={(e) => setInputAmount(parseFloat(e.target.value) || 0)}
              placeholder={`Amount in ${inputToken}`}
              className="w-full"
              min={0}
            />
            <Input
              type="number"
              value={slippage}
              onChange={(e) => setSlippage(parseFloat(e.target.value) || 0)}
              placeholder="Slippage (%)"
              className="w-full"
              min={0}
              step={0.1}
            />
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button
              onClick={handleGetRoutes}
              className="w-full"
              disabled={isLoading || inputAmount <= 0}
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Get Routes'}
            </Button>
            {routes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold">Available Routes</h3>
                <div className="space-y-2">
                  {routes.map((route, index) => (
                    <Button
                      key={index}
                      onClick={() => {
                        setSelectedRoute(route);
                        toast({ title: 'Route selected', description: `Selected route for ${route.outAmount / 10 ** 9} ${outputToken}` });
                      }}
                      className={`w-full ${selectedRoute === route ? 'bg-blue-500 text-white' : ''}`}
                    >
                      {`${route.inAmount / 10 ** 9} ${inputToken} ➜ ${route.outAmount / 10 ** 9} ${outputToken}`}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSwap} className="w-full" disabled={!selectedRoute || isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Swap'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
