import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowDownUp } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

const tokens = ['MILTON', 'SOL', 'USDC', 'ETH']

export function Swap() {
  const [fromToken, setFromToken] = useState(tokens[0])
  const [toToken, setToToken] = useState(tokens[1])
  const [amount, setAmount] = useState('')
  const { toast } = useToast()

  const handleSwap = () => {
    toast({
      title: "Swap Executed",
      description: `Swapped ${amount} ${fromToken} to ${toToken}`,
    })
    setAmount('')
  }

  const handleFlip = () => {
    setFromToken(toToken)
    setToToken(fromToken)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Swap Tokens</CardTitle>
        <CardDescription>Exchange your tokens instantly</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>From</Label>
            <div className="flex space-x-2">
              <Select value={fromToken} onValueChange={setFromToken}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent>
                  {tokens.map((token) => (
                    <SelectItem key={token} value={token}>{token}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-center">
            <Button variant="outline" size="icon" onClick={handleFlip}>
              <ArrowDownUp className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            <Label>To</Label>
            <div className="flex space-x-2">
              <Select value={toToken} onValueChange={setToToken}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent>
                  {tokens.map((token) => (
                    <SelectItem key={token} value={token}>{token}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input placeholder="0.00" readOnly value={(parseFloat(amount) * 0.95).toFixed(2)} />
            </div>
          </div>
          <Button className="w-full" onClick={handleSwap}>Swap</Button>
        </div>
      </CardContent>
    </Card>
  )
}