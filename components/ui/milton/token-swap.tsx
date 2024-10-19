'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowRight, RefreshCw, Info } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { toast } from '@/components/ui/use-toast'
import Image from 'next/image'

interface Token {
  symbol: string
  name: string
  icon: string
}

const tokens: Token[] = [
  { symbol: 'SOL', name: 'Solana', icon: 'https://ucarecdn.com/8bcc4664-01b2-4a88-85bc-9ebce234f08b/sol.png' },
  { symbol: 'USDC', name: 'USD Coin', icon: 'https://ucarecdn.com/67e17a97-f3bd-46c0-8627-e13b8b939d26/usdc.png' },
  { symbol: 'MILTON', name: 'Milton', icon: 'https://ucarecdn.com/fe802b60-cb87-4adc-8e1d-1b16a05f9420/miltonlogoicon.svg' },
]

interface SwapRate {
  [key: string]: number
}

interface Transaction {
  transactionId: string
  fromToken: string
  toToken: string
  amountIn: number
  amountOut: number
  fee: number
  timestamp: string
}

const JupiterIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#F5F5F5"/>
    <path d="M12 22.8C17.9647 22.8 22.8 17.9647 22.8 12C22.8 6.03532 17.9647 1.2 12 1.2C6.03532 1.2 1.2 6.03532 1.2 12C1.2 17.9647 6.03532 22.8 12 22.8Z" fill="#16CDFD"/>
    <path d="M12 21.6C17.3019 21.6 21.6 17.3019 21.6 12C21.6 6.69807 17.3019 2.4 12 2.4C6.69807 2.4 2.4 6.69807 2.4 12C2.4 17.3019 6.69807 21.6 12 21.6Z" fill="#111111"/>
    <path d="M15.6 12C15.6 14.0823 13.9882 15.6 12 15.6C10.0118 15.6 8.4 14.0823 8.4 12C8.4 9.91766 10.0118 8.4 12 8.4C13.9882 8.4 15.6 9.91766 15.6 12Z" fill="#16CDFD"/>
  </svg>
)

const SwapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 10L3 14L7 18" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 14H3" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 6L21 10L17 14" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 10H21" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function TokenSwap() {
  const [fromToken, setFromToken] = useState<Token>(tokens[0])
  const [toToken, setToToken] = useState<Token>(tokens[1])
  const [amount, setAmount] = useState<string>('')
  const [slippage, setSlippage] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [swapRates, setSwapRates] = useState<SwapRate>({})
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    fetchSwapRates()
  }, [])

  const fetchSwapRates = async () => {
    try {
      const response = await fetch('/api/swap')
      const data = await response.json()
      setSwapRates(data)
    } catch (error) {
      console.error('Error fetching swap rates:', error)
      toast({
        title: "Error",
        description: "Failed to fetch current swap rates.",
        variant: "destructive",
      })
    }
  }

  const handleFromTokenChange = (value: string) => {
    const newFromToken = tokens.find(t => t.symbol === value) || tokens[0]
    setFromToken(newFromToken)
    if (newFromToken.symbol === toToken.symbol) {
      setToToken(fromToken)
    }
  }

  const handleToTokenChange = (value: string) => {
    const newToToken = tokens.find(t => t.symbol === value) || tokens[1]
    setToToken(newToToken)
    if (newToToken.symbol === fromToken.symbol) {
      setFromToken(toToken)
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setAmount(value)
  }

  const handleSwap = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to swap.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/swap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromToken: fromToken.symbol,
          toToken: toToken.symbol,
          amount: parseFloat(amount),
          slippage,
          walletAddress: 'MOCK_WALLET_ADDRESS', // Replace with actual wallet address in production
        }),
      })

      if (!response.ok) {
        throw new Error('Swap request failed')
      }

      const result: Transaction = await response.json()
      setRecentTransactions(prev => [result, ...prev.slice(0, 2)])
      toast({
        title: "Swap Successful",
        description: `Swapped ${result.amountIn} ${fromToken.symbol} to ${result.amountOut.toFixed(6)} ${toToken.symbol}`,
      })
      setAmount('')
    } catch (error) {
      console.error('Swap error:', error)
      toast({
        title: "Swap Failed",
        description: "An error occurred while processing your swap. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const estimatedOutput = () => {
    const rate = swapRates[`${fromToken.symbol}/${toToken.symbol}`]
    if (!rate || !amount) return '0'
    return (parseFloat(amount) * rate * (1 - slippage / 100)).toFixed(6)
  }

  const calculateTotalFee = () => {
    if (!amount) return '0'
    const miltonFee = parseFloat(amount) * 0.005 // 0.5% Milton fee
    const jupiterFee = parseFloat(amount) * 0.0005 // Assuming 0.05% Jupiter fee
    const solanaFee = 0.000005 // Assuming a fixed 0.000005 SOL Solana network fee
    return (miltonFee + jupiterFee + solanaFee).toFixed(6)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-center text-gray-600 mb-8">Swap tokens easily and efficiently on the Solana blockchain</p>
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <SwapIcon />
              <span className="ml-2">Swap</span>
            </CardTitle>
            <CardDescription>Exchange your tokens at the best rates</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSwap} className="space-y-4">
              <div>
                <Label htmlFor="fromToken">From</Label>
                <div className="flex items-center space-x-2">
                  <Select value={fromToken.symbol} onValueChange={handleFromTokenChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent>
                      {tokens.map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol}>
                          <div className="flex items-center">
                            <Image src={token.icon} alt={token.name} width={24} height={24} className="mr-2" />
                            {token.symbol}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="fromAmount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={handleAmountChange}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <ArrowDown className="text-gray-500" />
              </div>
              <div>
                <Label htmlFor="toToken">To</Label>
                <div className="flex items-center space-x-2">
                  <Select value={toToken.symbol} onValueChange={handleToTokenChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent>
                      {tokens.map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol}>
                          <div className="flex items-center">
                            <Image src={token.icon} alt={token.name} width={24} height={24} className="mr-2" />
                            {token.symbol}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="toAmount"
                    type="number"
                    placeholder="0.00"
                    value={estimatedOutput()}
                    readOnly
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="slippage">Slippage Tolerance (%)</Label>
                <Input
                  id="slippage"
                  type="number"
                  placeholder="1.00"
                  value={slippage}
                  onChange={(e) => setSlippage(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="text-sm text-gray-600">
                <p>Estimated fees: {calculateTotalFee()} {fromToken.symbol}</p>
                <p>Includes: 0.5% Milton fee + Jupiter and Solana network fees</p>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Swapping...
                  </>
                ) : (
                  <>
                    Swap
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center items-center text-sm text-gray-600">
            <span className="mr-2">Powered by</span>
            <JupiterIcon />
            <span className="ml-1">Jupiter</span>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your last 3 swap transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recentTransactions.map((tx) => (
                <li key={tx.transactionId} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span>{tx.amountIn.toFixed(6)} {tx.fromToken}</span>
                      <ArrowRight className="h-4 w-4" />
                      <span>{tx.amountOut.toFixed(6)} {tx.toToken}</span>
                    </div>
                    <span className="text-sm  text-gray-500">{new Date(tx.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    Fee: {tx.fee.toFixed(6)} {tx.fromToken}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}