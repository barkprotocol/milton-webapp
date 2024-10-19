'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useConnection } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram } from '@solana/web3.js'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2 } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"

// This should be replaced with the actual MILTON token mint address
const MILTON_MINT_ADDRESS = new PublicKey('YOUR_MILTON_MINT_ADDRESS_HERE')
const MILTON_DECIMALS = 9 // Assuming MILTON has 9 decimals like SOL

type BuyMiltonFormProps = {
  onSuccess: (signature: string) => void
  onError: (error: string) => void
}

export function BuyMiltonForm({ onSuccess, onError }: BuyMiltonFormProps) {
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [estimatedMilton, setEstimatedMilton] = useState<string>('0')

  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()

  useEffect(() => {
    // Estimate MILTON tokens based on SOL amount
    const estimateMilton = async () => {
      if (amount && !isNaN(parseFloat(amount))) {
        // This is a placeholder calculation. Replace with actual rate fetching logic.
        const miltonAmount = parseFloat(amount) * 10 // Assuming 1 SOL = 10 MILTON
        setEstimatedMilton(miltonAmount.toFixed(MILTON_DECIMALS))
      } else {
        setEstimatedMilton('0')
      }
    }

    estimateMilton()
  }, [amount])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    if (!publicKey) {
      setError('Wallet not connected')
      setIsLoading(false)
      return
    }

    try {
      const amountLamports = parseFloat(amount) * LAMPORTS_PER_SOL
      if (isNaN(amountLamports) || amountLamports <= 0) {
        throw new Error('Invalid amount')
      }

      // This is a placeholder for the actual transaction creation
      // You would need to implement the actual swap logic here
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: MILTON_MINT_ADDRESS,
          lamports: amountLamports,
        })
      )

      const signature = await sendTransaction(transaction, connection)
      await connection.confirmTransaction(signature, 'confirmed')

      toast({
        title: "Purchase Successful",
        description: `You have successfully purchased ${estimatedMilton} MILTON tokens.`,
      })

      onSuccess(signature)
    } catch (err) {
      console.error('Transaction failed', err)
      const errorMessage = err instanceof Error ? err.message : 'Transaction failed'
      setError(errorMessage)
      onError(errorMessage)

      toast({
        title: "Purchase Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Buy MILTON Tokens</CardTitle>
        <CardDescription>Enter the amount of SOL you want to spend</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="amount">Amount (SOL)</Label>
              <Input
                id="amount"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                step="0.000000001"
                min="0"
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Estimated MILTON</Label>
              <Input value={estimatedMilton} readOnly />
            </div>
          </div>
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setAmount('')}>Clear</Button>
          <Button type="submit" disabled={isLoading || !publicKey}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing
              </>
            ) : (
              'Buy MILTON'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}