'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Sparkles } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

export function Governance() {
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [votingSystem, setVotingSystem] = useState('')
  const [endDate, setEndDate] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulating a successful response
      toast({
        title: "Proposal Created",
        description: `Your governance proposal "${title}" has been successfully created!`,
      })
      
      // Reset form fields after successful submission
      setTitle('')
      setDescription('')
      setVotingSystem('')
      setEndDate('')
    } catch (error) {
      console.error('Error creating governance proposal:', error)
      toast({
        title: "Error",
        description: "Failed to create governance proposal. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a Governance Proposal</CardTitle>
        <CardDescription>Submit a new proposal for community voting</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Proposal Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter the proposal title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Proposal Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your proposal in detail"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="votingSystem">Voting System</Label>
            <Select value={votingSystem} onValueChange={setVotingSystem}>
              <SelectTrigger id="votingSystem" className="w-full">
                <SelectValue placeholder="Select a voting system" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single-choice">Single Choice</SelectItem>
                <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                <SelectItem value="ranked-choice">Ranked Choice</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">Voting End Date</Label>
            <Input
              id="endDate"
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full"
              min={new Date().toISOString().split('T')[0]} // Set minimum date to today
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
      </CardContent>
    </Card>
  )
}