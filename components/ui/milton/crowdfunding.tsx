'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Zap, Sparkles } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

export function Crowdfunding() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    toast({
      title: "Crowdfunding Blink Created",
      description: "Your crowdfunding blink has been successfully created!",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Project Name"
        required
        className="w-full"
      />
      <Input
        type="number"
        placeholder="Funding Goal (USDC)"
        required
        className="w-full"
      />
      <Input
        type="date"
        placeholder="End Date"
        required
        className="w-full"
      />
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90  text-white" disabled={isLoading}>
        {isLoading ? (
          <>
            <Sparkles className="mr-2 h-4 w-4 animate-spin" />
            Creating Crowdfunding Blink...
          </>
        ) : (
          <>
            Create Crowdfunding Blink
            <Zap className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  )
}