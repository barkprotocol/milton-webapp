'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from 'lucide-react'

export default function BlinkboardPage() {
  const { publicKey } = useWallet()
  const [blinks, setBlinks] = useState<Array<{ text: string }>>([])
  const [newBlinkText, setNewBlinkText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (publicKey) {
      fetchBlinks()
    }
  }, [publicKey])

  const fetchBlinks = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/v1/blinks?wallet=${publicKey?.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch blinks')
      }
      const data = await response.json()
      setBlinks(data.blinks)
    } catch (err) {
      console.error('Error fetching blinks:', err)
      setError('Failed to fetch blinks. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const createBlink = async () => {
    if (!newBlinkText.trim() || !publicKey) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/blinks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newBlinkText, wallet: publicKey.toString() }),
      })
      if (!response.ok) {
        throw new Error('Failed to create blink')
      }
      const data = await response.json()
      setBlinks([...blinks, data.blink])
      setNewBlinkText('')
    } catch (err) {
      console.error('Error creating blink:', err)
      setError('Failed to create blink. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!publicKey) {
    return (
      <div className="container mx-auto p-4">
        <Alert>
          <AlertTitle>Wallet not connected</AlertTitle>
          <AlertDescription>Please connect your wallet to use Blinkboard.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Blinkboard</CardTitle>
          <CardDescription>Create and view your blinks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="What's on your mind?"
              value={newBlinkText}
              onChange={(e) => setNewBlinkText(e.target.value)}
            />
            <Button onClick={createBlink} disabled={isLoading || !newBlinkText.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Blink...
                </>
              ) : (
                'Create Blink'
              )}
            </Button>
          </div>
          <div className="mt-6 space-y-4">
            {blinks.map((blink, index) => (
              <Card key={index}>
                <CardContent className="pt-4">
                  {blink.text}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}