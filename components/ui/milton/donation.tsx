'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Gift, Sparkles } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

export function Donation() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    toast({
      title: "Donation Blink Created",
      description: "Your donation blink has been successfully created!",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Cause Name"
        required
        className="w-full"
      />
      <Input
        type="number"
        placeholder="Donation Goal (USDC)"
        required
        className="w-full"
      />
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" disabled={isLoading}>
        {isLoading ? (
          <>
            <Sparkles className="mr-2 h-4 w-4 animate-spin" />
            Creating Donation Blink...
          </>
        ) : (
          <>
            Create Donation Blink
            <Gift className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  )
}