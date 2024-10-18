'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Coins, Sparkles } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

export function MintToken() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    toast({
      title: "Token Created",
      description: "Your token has been successfully created!",
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
      <Textarea
        placeholder="Token Description"
        className="w-full"
      />
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" disabled={isLoading}>
        {isLoading ? (
          <>
            <Sparkles className="mr-2 h-4 w-4 animate-spin" />
            Creating Token...
          </>
        ) : (
          <>
            Create Token
            <Coins className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  )
}