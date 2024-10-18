'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction } from '@solana/spl-token'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, AlertCircle, CheckCircle2, Calculator, Info } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { WalletButton } from "@/components/ui/wallet-button"

const MILTON_MINT = new PublicKey('4DsZctdxSVNLGYB5YtY8A8JDg6tUoSZnQHSamXecKWWf')
const MILTON_DECIMALS = 9
const MILTON_PRICE = 0.000001 // Price in USDC

type TransactionType = 'buy' | 'sell' | 'transfer'
type TokenVersion = 'spl' | 'token2022'
type Currency = 'USD' | 'SOL' | 'USDC'

interface FeeAllocation {
  liquidityPool: number
  communityTreasury: number
  charitableCauses: number
  developmentFund: number
  governance: number
  treasuryFund: number
}

const feeAllocations: Record<TokenVersion, FeeAllocation> = {
  spl: {
    liquidityPool: 0.35,
    communityTreasury: 0.25,
    charitableCauses: 0.20,
    developmentFund: 0.10,
    governance: 0.05,
    treasuryFund: 0.05,
  },
  token2022: {
    liquidityPool: 0.45,
    communityTreasury: 0.20,
    charitableCauses: 0.15,
    developmentFund: 0.10,
    governance: 0.05,
    treasuryFund: 0.05,
  },
}

const feeRates: Record<TokenVersion, Record<TransactionType, number>> = {
  spl: {
    buy: 0.015,
    sell: 0.02,
    transfer: 0.005,
  },
  token2022: {
    buy: 0.05,
    sell: 0.05,
    transfer: 0.05,
  },
}

interface SalePhase {
  name: string
  description: string
  startDate: string
  endDate: string
  price: number
  minPurchase: number
  maxPurchase: number
  totalSupply: number
  status: 'active' | 'upcoming' | 'ended'
}

const salePhases: SalePhase[] = [
  {
    name: 'Pre-Sale',
    description: 'Early access for supporter addresses',
    startDate: '2024-11-01T00:00:00Z',
    endDate: '2024-11-14T15:59:59Z',
    price: 0.00001,
    minPurchase: 1000,
    maxPurchase: 100000,
    totalSupply: 1000000000,
    status: 'active',
  },
  {
    name: 'Public Sale',
    description: 'Open to all participants',
    startDate: '2024-12-08T00:00:00Z',
    endDate: '2024-11-21T23:59:59Z',
    price: 0.000015,
    minPurchase: 100,
    maxPurchase: 1000000,
    totalSupply: 5000000000,
    status: 'upcoming',
  },
  {
    name: 'Final Sale',
    description: 'Last chance to participate',
    startDate: '2024-01-16T00:00:00Z',
    endDate: '2024-11-28T23:59:59Z',
    price: 0.00002,
    minPurchase: 10,
    maxPurchase: 10000000,
    totalSupply: 12067600000,
    status: 'upcoming',
  },
]

export default function TokenSaleCalculator() {
  const [activeTab, setActiveTab] = useState<'sale' | 'calculator'>('sale')
  const [activePhase, setActivePhase] = useState<string>('pre-sale')
  const [amount, setAmount] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [saleProgress, setSaleProgress] = useState<number>(0)
  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()
  const { toast } = useToast()

  // Calculator states
  const [transactionType, setTransactionType] = useState<TransactionType>('buy')
  const [tokenVersion, setTokenVersion] = useState<TokenVersion>('spl')
  const [inputCurrency, setInputCurrency] = useState<Currency>('USD')
  const [outputCurrency, setOutputCurrency] = useState<Currency>('USD')
  const [fee, setFee] = useState<number>(0)
  const [miltonAmount, setMiltonAmount] = useState<number>(0)
  const [totalCost, setTotalCost] = useState<number>(0)
  const [allocation, setAllocation] = useState<Record<keyof FeeAllocation, number>>({} as Record<keyof FeeAllocation, number>)
  const [solPrice, setSolPrice] = useState<number>(0)
  const [usdcPrice, setUsdcPrice] = useState<number>(0)
  const [calculatorError, setCalculatorError] = useState<string | null>(null)

  const fetchSaleData = useCallback(async () => {
    try {
      const response = await fetch('/api/v1/sale-progress')
      if (!response.ok) {
        throw new Error('Failed to fetch sale progress')
      }
      const data = await response.json()
      setSaleProgress(data.progress)
    } catch (error) {
      console.error('Error fetching sale progress:', error)
      toast({
        title: "Error",
        description: "Failed to fetch sale progress. Please try again later.",
        variant: "destructive",
      })
    }
  }, [toast])

  const fetchPrices = useCallback(async () => {
    setIsLoading(true)
    setCalculatorError(null)
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana,usd-coin&vs_currencies=usd')
      if (!response.ok) {
        throw new Error('Failed to fetch prices')
      }
      const data = await response.json()
      setSolPrice(data.solana.usd)
      setUsdcPrice(data['usd-coin'].usd)
    } catch (error) {
      console.error('Error fetching prices:', error)
      setCalculatorError('Failed to fetch current prices. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSaleData()
    fetchPrices()

    const saleInterval = setInterval(fetchSaleData, 30000)
    const priceInterval = setInterval(fetchPrices, 60000)

    return () => {
      clearInterval(saleInterval)
      clearInterval(priceInterval)
    }
  }, [fetchSaleData, fetchPrices])

  const calculateResults = useMemo(() => {
    if (isLoading || calculatorError || !amount) return null

    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) return null

    const feeRate = feeRates[tokenVersion][transactionType]
    const feeAmount = amountNum * feeRate

    const convertToUSD = (value: number, currency: Currency) => {
      switch (currency) {
        case 'SOL':
          return value * solPrice
        case 'USDC':
          return value * usdcPrice
        default:
          return value
      }
    }

    const convertFromUSD = (value: number, currency: Currency) => {
      switch (currency) {
        case 'SOL':
          return value / solPrice
        case 'USDC':
          return value / usdcPrice
        default:
          return value
      }
    }

    const amountInUSD = convertToUSD(amountNum, inputCurrency)
    const newMiltonAmount = amountInUSD / MILTON_PRICE
    const newTotalCost = amountInUSD + convertToUSD(feeAmount, inputCurrency)

    const newAllocation = Object.entries(feeAllocations[tokenVersion]).reduce((acc, [key, value]) => {
      acc[key as keyof FeeAllocation] = convertFromUSD(feeAmount * value, outputCurrency)
      return acc
    }, {} as Record<keyof FeeAllocation, number>)

    return {
      fee: convertFromUSD(feeAmount, outputCurrency),
      miltonAmount: newMiltonAmount,
      totalCost: convertFromUSD(newTotalCost, outputCurrency),
      allocation: newAllocation,
    }
  }, [amount, transactionType, tokenVersion, inputCurrency, outputCurrency, solPrice, usdcPrice, isLoading, calculatorError])

  useEffect(() => {
    if (calculateResults) {
      setFee(calculateResults.fee)
      setMiltonAmount(calculateResults.miltonAmount)
      setTotalCost(calculateResults.totalCost)
      setAllocation(calculateResults.allocation)
    }
  }, [calculateResults])

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setAmount(value)
  }

  const formatCurrency = (value: number, currency: Currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'SOL' ? 'USD' : currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(value).replace('$', currency === 'SOL' ? 'SOL ' : '$')
  }

  const formatNumber = (value: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value)
  }

  const handleTransaction = async (phase: SalePhase) => {
    if (!publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to participate in the sale.",
        variant: "destructive",
      })
      return
    }

    if (!amount || isNaN(parseFloat(amount))) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid token amount.",
        variant: "destructive",
      })
      return
    }

    const tokenAmount = parseFloat(amount)
    if (tokenAmount < phase.minPurchase || tokenAmount > phase.maxPurchase) {
      toast({
        title: "Invalid purchase amount",
        description: `Please enter an amount between ${phase.minPurchase} and ${phase.maxPurchase} tokens.`,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const transaction = new Transaction()

      // Create associated token account for the user if it doesn't exist
      const userAssociatedTokenAccount = await getAssociatedTokenAddress(
        MILTON_MINT,
        publicKey
      )

      const accountInfo = await connection.getAccountInfo(userAssociatedTokenAccount)
      if (!accountInfo) {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            publicKey,
            userAssociatedTokenAccount,
            publicKey,
            MILTON_MINT
          )
        )
      }

      // Add transfer instruction
      const miltonAmount = tokenAmount * Math.pow(10, MILTON_DECIMALS)
      transaction.add(
        createTransferInstruction(
          MILTON_MINT, // From the mint (assuming the sale contract controls minting)
          userAssociatedTokenAccount,
          publicKey,
          miltonAmount
        )
      )

      // Add payment instruction (assuming payment in SOL for simplicity)
      const lamports = Math.floor(tokenAmount * phase.price * LAMPORTS_PER_SOL)
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: MILTON_MINT, // Replace with the actual sale contract address
          lamports: lamports,
        })
      )

      const signature = await sendTransaction(transaction, connection)
      
      toast({
        title: "Transaction submitted",
        description: (
          <div className="flex items-center">
            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
            <span>
              Your transaction has been submitted.{' '}
              <a
                href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                View on Solana Explorer
              </a>
            </span>
          </div>
        ),
      })
    } catch (error) {
      console.error('Transaction failed:', error)
      toast({
        title: "Transaction failed",
        description: (error as Error).message || "An error occurred while processing your transaction. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTransfer = async () => {
    if (!publicKey) {
      
      
      
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to transfer tokens.",
        variant: "destructive",
      })
      return
    }

    if (!amount || isNaN(parseFloat(amount))) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid token amount.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const transaction = new Transaction()

      // Get the user's associated token account
      const userAssociatedTokenAccount = await getAssociatedTokenAddress(
        MILTON_MINT,
        publicKey
      )

      // Add transfer instruction
      const miltonAmount = parseFloat(amount) * Math.pow(10, MILTON_DECIMALS)
      transaction.add(
        createTransferInstruction(
          userAssociatedTokenAccount,
          userAssociatedTokenAccount, // Replace with the recipient's token account
          publicKey,
          miltonAmount
        )
      )

      const signature = await sendTransaction(transaction, connection)
      
      toast({
        title: "Transfer submitted",
        description: (
          <div className="flex items-center">
            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
            <span>
              Your transfer has been submitted.{' '}
              <a
                href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                View on Solana Explorer
              </a>
            </span>
          </div>
        ),
      })
    } catch (error) {
      console.error('Transfer failed:', error)
      toast({
        title: "Transfer failed",
        description: (error as Error).message || "An error occurred while processing your transfer. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-12 sm:py-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">MILTON Token Sale & Calculator</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Participate in our token sale and calculate your potential MILTON tokens
          </p>
        </motion.div>

        <div className="flex justify-center mb-8">
          <WalletButton />
        </div>

        <Tabs value={activeTab} onValueChange={(value: 'sale' | 'calculator') => setActiveTab(value)} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sale">Token Sale</TabsTrigger>
            <TabsTrigger value="calculator">Token Calculator</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="sale">
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Sale Progress</CardTitle>
                    <CardDescription>Overall token sale progress across all phases</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Progress value={saleProgress} className="w-full" />
                    <p className="text-sm text-muted-foreground mt-2">{formatNumber(saleProgress)}% of tokens sold</p>
                  </CardContent>
                </Card>

                <Tabs value={activePhase} onValueChange={setActivePhase} className="space-y-8">
                  <TabsList className="grid w-full grid-cols-3 gap-4">
                    {salePhases.map((phase) => (
                      <TabsTrigger
                        key={phase.name}
                        value={phase.name.toLowerCase().replace(' ', '-')}
                        className="w-full"
                      >
                        {phase.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {salePhases.map((phase) => (
                    <TabsContent key={phase.name} value={phase.name.toLowerCase().replace(' ', '-')}>
                      <Card>
                        <CardHeader>
                          <CardTitle>{phase.name}</CardTitle>
                          <CardDescription>{phase.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Start Date</Label>
                              <p>{new Date(phase.startDate).toLocaleString()}</p>
                            </div>
                            <div>
                              <Label>End Date</Label>
                              <p>{new Date(phase.endDate).toLocaleString()}</p>
                            </div>
                            <div>
                              <Label>Price</Label>
                              <p>{formatNumber(phase.price, 6)} USDC</p>
                            </div>
                            <div>
                              <Label>Total Supply</Label>
                              <p>{formatNumber(phase.totalSupply)} MILTON</p>
                            </div>
                            <div>
                              <Label>Min Purchase</Label>
                              <p>{formatNumber(phase.minPurchase)} MILTON</p>
                            </div>
                            <div>
                              <Label>Max Purchase</Label>
                              <p>{formatNumber(phase.maxPurchase)} MILTON</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="amount">Amount to Purchase</Label>
                            <Input
                              id="amount"
                              type="number"
                              placeholder="Enter MILTON amount"
                              value={amount}
                              onChange={handleAmountChange}
                              min={phase.minPurchase}
                              max={phase.maxPurchase}
                            />
                          </div>
                          {amount && (
                            <Alert>
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>Purchase Summary</AlertTitle>
                              <AlertDescription>
                                You will receive {formatNumber(parseFloat(amount))} MILTON tokens for {formatNumber(parseFloat(amount) * phase.price, 2)} USDC
                              </AlertDescription>
                            </Alert>
                          )}
                        </CardContent>
                        <CardFooter>
                          <Button
                            size="lg"
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                            disabled={phase.status !== 'active' || isLoading || !publicKey}
                            onClick={() => handleTransaction(phase)}
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : phase.status === 'active' ? (
                              'Participate in Sale'
                            ) : (
                              'Coming Soon'
                            )}
                          </Button>
                        </CardFooter>
                      </Card>
                    </TabsContent>
                  ))}
                </Tabs>
              </TabsContent>

              <TabsContent value="calculator">
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">MILTON Token Calculator</CardTitle>
                    <CardDescription>Calculate token amounts, fees, and total costs for SPL and Token-2022 versions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {calculatorError && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{calculatorError}</AlertDescription>
                      </Alert>
                    )}
                    {isLoading ? (
                      <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin" />
                      </div>
                    ) : (
                      <>
                        <Tabs value={tokenVersion} onValueChange={(value: TokenVersion) => setTokenVersion(value)} className="mb-6">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="spl">SPL Token</TabsTrigger>
                            <TabsTrigger value="token2022">Token-2022</TabsTrigger>
                          </TabsList>
                          <TabsContent value="spl" className="mt-4">
                            <div className="space-y-4">
                              <div className="grid gap-2">
                                <Label htmlFor="amount-spl">Amount</Label>
                                <div className="flex gap-2">
                                  <Input
                                    id="amount-spl"
                                    type="number"
                                    placeholder="Enter amount"
                                    value={amount}
                                    onChange={handleAmountChange}
                                    className="flex-grow"
                                  />
                                  <Select value={inputCurrency} onValueChange={(value: Currency) => setInputCurrency(value)}>
                                    <SelectTrigger className="w-[100px]">
                                      <SelectValue placeholder="Currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="USD">USD</SelectItem>
                                      <SelectItem value="SOL">SOL</SelectItem>
                                      <SelectItem value="USDC">USDC</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="transaction-type-spl">Transaction Type</Label>
                                <Select onValueChange={(value: TransactionType) => setTransactionType(value)}>
                                  <SelectTrigger id="transaction-type-spl">
                                    <SelectValue placeholder="Select transaction type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="buy">Buy</SelectItem>
                                    <SelectItem value="sell">Sell</SelectItem>
                                    <SelectItem value="transfer">Transfer</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </TabsContent>
                          <TabsContent value="token2022" className="mt-4">
                            <div className="space-y-4">
                              <div className="grid gap-2">
                                <Label htmlFor="amount-token2022">Amount</Label>
                                <div className="flex gap-2">
                                  <Input
                                    id="amount-token2022"
                                    type="number"
                                    placeholder="Enter amount"
                                    value={amount}
                                    onChange={handleAmountChange}
                                    className="flex-grow"
                                  />
                                  <Select value={inputCurrency} onValueChange={(value: Currency) => setInputCurrency(value)}>
                                    <SelectTrigger className="w-[100px]">
                                      <SelectValue placeholder="Currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="USD">USD</SelectItem>
                                      <SelectItem value="SOL">SOL</SelectItem>
                                      <SelectItem value="USDC">USDC</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Note: Token-2022 version has a flat 5% fee for all transaction types.
                              </p>
                            </div>
                          </TabsContent>
                        </Tabs>
                        <div className="space-y-6">
                          <div className="p-4 bg-secondary rounded-lg">
                            <h3 className="font-semibold mb-2">Calculation Results</h3>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span>Output Currency:</span>
                                <Select value={outputCurrency} onValueChange={(value: Currency) => setOutputCurrency(value)}>
                                  <SelectTrigger className="w-[100px]">
                                    <SelectValue placeholder="Currency" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="USD">USD</SelectItem>
                                    <SelectItem value="SOL">SOL</SelectItem>
                                    <SelectItem value="USDC">USDC</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <p>MILTON Tokens: {formatNumber(miltonAmount, 6)}</p>
                              <p>Transaction Fee: {formatCurrency(fee, outputCurrency)} ({formatNumber(fee / parseFloat(amount || '0') * 100, 2)}%)</p>
                              <p className="font-bold">Total Cost: {formatCurrency(totalCost, outputCurrency)}</p>
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2">Fee Allocation Breakdown</h3>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Allocation</TableHead>
                                  <TableHead>Amount</TableHead>
                                  <TableHead>Percentage</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {Object.entries(allocation).map(([key, value]) => (
                                  <TableRow key={key}>
                                    <TableCell className="font-medium">
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <span className="cursor-help flex items-center">
                                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                              <Info className="h-4 w-4 ml-1" />
                                            </span>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Explanation for {key} allocation</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    </TableCell>
                                    <TableCell>{formatCurrency(value, outputCurrency)}</TableCell>
                                    <TableCell>{formatNumber(value / fee * 100, 2)}%</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          {transactionType === 'transfer' && (
                            <div className="mt-4">
                              <Button
                                size="lg"
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                                onClick={handleTransfer}
                                disabled={isLoading || !publicKey}
                              >
                                {isLoading ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing Transfer...
                                  </>
                                ) : (
                                  'Transfer MILTON Tokens'
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
    </section>
  )
}