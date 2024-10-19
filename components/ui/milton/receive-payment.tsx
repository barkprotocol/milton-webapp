'use client'

import { useState, useEffect } from 'react'
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { AlertCircle, Loader2, QrCode, Copy, Check, Download, RefreshCw } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import QRCode from 'qrcode.react'

type PaymentType = 'crypto' | 'nft'
type CryptoCurrency = 'USDC' | 'SOL' | 'MILTON'

interface ExchangeRate {
  [key: string]: number;
}

const ReceivePayment = () => {
  const [paymentType, setPaymentType] = useState<PaymentType>('crypto')
  const [currency, setCurrency] = useState<CryptoCurrency>('USDC')
  const [amount, setAmount] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [nftId, setNftId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showQR, setShowQR] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate>({})
  const { toast } = useToast()

  useEffect(() => {
    fetchExchangeRates()
  }, [])

  const fetchExchangeRates = async () => {
    try {
      // Simulating API call to fetch exchange rates
      const response = await fetch('/api/exchange-rates')
      const data = await response.json()
      setExchangeRates(data.rates)
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error)
      toast({
        title: "Error",
        description: "Failed to fetch exchange rates. Using default values.",
        variant: "destructive",
      })
      setExchangeRates({ USDC: 1, SOL: 0.05, MILTON: 0.1 })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (paymentType === 'crypto' && !validateAmount(amount)) {
        throw new Error('Invalid amount')
      }

      if (paymentType === 'nft' && !validateNftId(nftId)) {
        throw new Error('Invalid NFT ID')
      }

      if (!validateWalletAddress(walletAddress)) {
        throw new Error('Invalid wallet address')
      }

      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      if (paymentType === 'crypto') {
        toast({
          title: "Payment Request Created",
          description: `Request for ${amount} ${currency} has been created.`,
        })
      } else {
        toast({
          title: "NFT Transfer Request Created",
          description: `Request for NFT #${nftId} has been created.`,
        })
      }

      setShowQR(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create payment request. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const validateAmount = (value: string): boolean => {
    const numValue = parseFloat(value)
    return !isNaN(numValue) && numValue > 0 && numValue <= 1000000 // Assuming a max limit of 1 million
  }

  const validateNftId = (value: string): boolean => {
    return /^[a-zA-Z0-9-]+$/.test(value) && value.length <= 64
  }

  const validateWalletAddress = (address: string): boolean => {
    // This is a simplified validation. In a real-world scenario, you'd use a more robust validation method.
    return /^[a-zA-Z0-9]{32,44}$/.test(address)
  }

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleDownloadQR = () => {
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream")
      let downloadLink = document.createElement("a")
      downloadLink.href = pngUrl
      downloadLink.download = `milton-payment-request-${Date.now()}.png`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    }
  }

  const getEquivalentAmount = (baseCurrency: CryptoCurrency, amount: string): string => {
    const baseAmount = parseFloat(amount)
    if (isNaN(baseAmount)) return 'N/A'

    const equivalents = Object.entries(exchangeRates)
      .filter(([key]) => key !== baseCurrency)
      .map(([key, rate]) => `${(baseAmount / rate).toFixed(6)} ${key}`)

    return equivalents.join(' | ')
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Receive Payment</CardTitle>
        <CardDescription>Create a payment or NFT transfer request</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={paymentType} onValueChange={(value) => setPaymentType(value as PaymentType)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="crypto">Cryptocurrency</TabsTrigger>
            <TabsTrigger value="nft">NFT</TabsTrigger>
          </TabsList>
          <TabsContent value="crypto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={(value) => setCurrency(value as CryptoCurrency)}>
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USDC">USDC</SelectItem>
                    <SelectItem value="SOL">SOL</SelectItem>
                    <SelectItem value="MILTON">MILTON</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  step="0.000000001"
                  min="0"
                  max="1000000"
                  required
                />
                {amount && (
                  <p className="text-sm text-gray-500">
                    Equivalent: {getEquivalentAmount(currency, amount)}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="wallet-address">Your Wallet Address</Label>
                <Input
                  id="wallet-address"
                  placeholder="Enter your wallet address"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="qr-code" checked={showQR} onCheckedChange={setShowQR} />
                <Label htmlFor="qr-code">Generate QR Code</Label>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Request
                  </>
                ) : (
                  'Create Payment Request'
                )}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="nft">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nft-id">NFT ID</Label>
                <Input
                  id="nft-id"
                  placeholder="Enter NFT ID"
                  value={nftId}
                  onChange={(e) => setNftId(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wallet-address-nft">Your Wallet Address</Label>
                <Input
                  id="wallet-address-nft"
                  placeholder="Enter your wallet address"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="qr-code-nft" checked={showQR} onCheckedChange={setShowQR} />
                <Label htmlFor="qr-code-nft">Generate QR Code</Label>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Request
                  </>
                ) : (
                  'Create NFT Transfer Request'
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      {showQR && (
        <CardFooter className="flex flex-col items-center space-y-4">
          <div className="text-center">
            <h3 className="font-semibold mb-2">Payment Request QR Code</h3>
            <QRCode
              id="qr-code"
              value={`milton:${walletAddress}?amount=${amount}&currency=${currency}&nftId=${nftId}`}
              size={200}
              level="H"
            />
          </div>
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleCopyAddress}>
                    {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span className="ml-2">{isCopied ? 'Copied!' : 'Copy Address'}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy wallet address to clipboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleDownloadQR}>
                    <Download className="h-4 w-4" />
                    <span className="ml-2">Download QR</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download QR code as PNG</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardFooter>
      )}
      <CardFooter className="flex justify-end">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={fetchExchangeRates}>
                <RefreshCw className="h-4 w-4" />
                <span className="ml-2">Refresh Rates</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh exchange rates</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  )
}

export default ReceivePayment