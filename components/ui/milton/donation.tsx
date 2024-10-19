'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Gift, Sparkles } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function Donation() {
  const [isLoading, setIsLoading] = useState(false)
  const [causeName, setCauseName] = useState('')
  const [donationGoal, setDonationGoal] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulating a successful response
      toast({
        title: "Donation Blink Created",
        description: `Your donation blink for "${causeName}" with a goal of ${donationGoal} USDC has been successfully created!`,
      })
      
      // Reset form fields after successful submission
      setCauseName('')
      setDonationGoal('')
    } catch (error) {
      console.error('Error creating donation blink:', error)
      toast({
        title: "Error",
        description: "Failed to create donation blink. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a Donation Blink</CardTitle>
        <CardDescription>Set up a new donation campaign for your cause</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="causeName">Cause Name</Label>
            <Input
              id="causeName"
              type="text"
              placeholder="Enter the name of your cause"
              required
              value={causeName}
              onChange={(e) => setCauseName(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="donationGoal">Donation Goal (USDC)</Label>
            <Input
              id="donationGoal"
              type="number"
              placeholder="Enter your donation goal"
              required
              min="1"
              step="0.01"
              value={donationGoal}
              onChange={(e) => setDonationGoal(e.target.value)}
              className="w-full"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-white" 
            disabled={isLoading}
          >
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
      </CardContent>
    </Card>
  )
}