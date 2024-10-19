'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, Send, Zap, Filter } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"

type Blink = {
  id: string
  text: string
  userId: string
  tags: string[]
  timestamp: string
}

export default function EnhancedBlinkDemo() {
  const [blinks, setBlinks] = useState<Blink[]>([])
  const [text, setText] = useState('')
  const [userId, setUserId] = useState('')
  const [tags, setTags] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [filterUserId, setFilterUserId] = useState('')
  const [filterTag, setFilterTag] = useState('')
  const [limit, setLimit] = useState('10')

  const fetchBlinks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const queryParams = new URLSearchParams()
      if (filterUserId) queryParams.append('userId', filterUserId)
      if (filterTag) queryParams.append('tag', filterTag)
      if (limit) queryParams.append('limit', limit)

      const response = await fetch(`/api/blinks?${queryParams.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch blinks')
      const data = await response.json()
      setBlinks(data)
    } catch (error) {
      setError('Failed to fetch blinks')
    } finally {
      setLoading(false)
    }
  }, [filterUserId, filterTag, limit])

  useEffect(() => {
    fetchBlinks()
  }, [fetchBlinks])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/blinks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          userId,
          tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create blink')
      }

      const newBlink = await response.json()
      setBlinks(prevBlinks => [newBlink, ...prevBlinks])
      setText('')
      setTags('')
      fetchBlinks()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4 text-center">Enhanced Milton Blinks Demo</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-6 h-6 text-yellow-500" />
            <span>Create a Blink</span>
          </CardTitle>
          <CardDescription>Share your thoughts in 280 characters or less</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter your user ID"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blinkText">Blink Text</Label>
              <Textarea
                id="blinkText"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What's on your mind?"
                required
                maxLength={280}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Enter tags"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Send className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Blink
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-6 h-6 text-yellow-500" />
            <span>Filter Blinks</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); fetchBlinks(); }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="filterUserId">Filter by User ID</Label>
              <Input
                id="filterUserId"
                value={filterUserId}
                onChange={(e) => setFilterUserId(e.target.value)}
                placeholder="Enter user ID to filter"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filterTag">Filter by Tag</Label>
              <Input
                id="filterTag"
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                placeholder="Enter tag to filter"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="limit">Limit Results</Label>
              <Input
                id="limit"
                type="number"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                placeholder="Enter limit"
                min="1"
              />
            </div>
            <Button type="submit" className="w-full">
              Apply Filters
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Blinks</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            {blinks.map((blink) => (
              <Card key={blink.id} className="mb-4">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">User ID: {blink.userId}</CardTitle>
                  <CardDescription>{new Date(blink.timestamp).toLocaleString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{blink.text}</p>
                  {blink.tags.length > 0 && (
                    <div className="mt-2">
                      {blink.tags.map((tag) => (
                        <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}