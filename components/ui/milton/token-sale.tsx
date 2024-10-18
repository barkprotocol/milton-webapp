'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DollarSign, Sparkles } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

export function TokenSale() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    toast({
      title: "Token Sale Created",
      description: "Your token sale has been successfully created!",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Token Name"
        required
        className="w-full"
      />
      <Input
        type="text"
        placeholder="Token Symbol"
        required
        className="w-full"
      />
      <Input
        type="number"
        placeholder="Total Supply"
        required
        className="w-full"
      />
      <Input
        type="number"
        placeholder="Price per Token (USDC)"
        required
        className="w-full"
      />
      <Input
        type="date"
        placeholder="Sale Start Date"
        required
        className="w-full"
      />
      <Input
        type="date"
        placeholder="Sale End Date"
        required
        className="w-full"
      />
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" disabled={isLoading}>
        {isLoading ? (
          <>
            <Sparkles className="mr-2 h-4 w-4 animate-spin" />
            Creating Token Sale...
          </>
        ) : (
          <>
            Create Token Sale
            <DollarSign className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  )
}