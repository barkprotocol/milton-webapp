'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Send, Sparkles } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

export function SendTransaction() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedToken, setSelectedToken] = useState('SOL')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    toast({
      title: "Transaction Sent",
      description: "Your transaction has been successfully sent!",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Recipient Address"
        required
        className="w-full"
      />
      <Select onValueChange={(value) => setSelectedToken(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Token" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="SOL">SOL</SelectItem>
          <SelectItem value="USDC">USDC</SelectItem>
          <SelectItem value="MILTON">MILTON</SelectItem>
          <SelectItem value="BARK">BARK</SelectItem>
        </SelectContent>
      </Select>
      <Input
        type="number"
        placeholder={`Amount (${selectedToken})`}
        required
        className="w-full"
      />
      <Textarea
        placeholder="Memo (Optional)"
        className="w-full"
      />
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" disabled={isLoading}>
        {isLoading ? (
          <>
            <Sparkles className="mr-2 h-4 w-4 animate-spin" />
            Sending Transaction...
          </>
        ) : (
          <>
            Send Transaction
            <Send className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  )
}