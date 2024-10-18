'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useConnection } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL, PublicKey, Transaction } from '@solana/web3.js'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2 } from 'lucide-react'

// This should be replaced with the actual MILTON token mint address
const MILTON_MINT_ADDRESS = 'YOUR_MILTON_MINT_ADDRESS_HERE'
const MILTON_DECIMALS = 9 // Assuming MILTON has 9 decimals like SOL

type BuyMiltonFormProps = {
  onSuccess: (signature: string) => void
  onError: (error: string) => void
}

export function BuyMiltonForm({ onSuccess, onError }: BuyMiltonFormProps) {
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()

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
        // Add instructions for swapping SOL to MILTON
        // This is just a placeholder and won't actually work
        // You need to implement the actual swap logic based on your token setup
      )

      const signature = await sendTransaction(transaction, connection)
      await connection.confirmTransaction(signature, 'confirmed')

      onSuccess(signature)
    } catch (err) {
      console.error('Transaction failed', err)
      setError(err instanceof Error ? err.message : 'Transaction failed')
      onError(err instanceof Error ? err.message : 'Transaction failed')
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