'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Users, Sparkles } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

export function Governance() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    toast({
      title: "Proposal Created",
      description: "Your governance proposal has been successfully created!",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Proposal Title"
        required
        className="w-full"
      />
      <Textarea
        placeholder="Proposal Description"
        required
        className="w-full"
      />
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Voting System" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="single-choice">Single Choice</SelectItem>
          <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
          <SelectItem value="ranked-choice">Ranked Choice</SelectItem>
        </SelectContent>
      </Select>
      <Input
        type="date"
        placeholder="Voting End Date"
        required
        className="w-full"
      />
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" disabled={isLoading}>
        {isLoading ? (
          <>
            <Sparkles className="mr-2 h-4 w-4 animate-spin" />
            Creating Proposal...
          </>
        ) : (
          <>
            Create Governance Proposal
            <Users className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  )
}