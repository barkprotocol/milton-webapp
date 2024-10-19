'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, Send, Zap, RefreshCcw, CreditCard, Heart, Coins, Vote, Gift, BookOpen, Repeat, PlusCircle, Discord, Telegram } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import Image from 'next/image'

type ApiResponse = {
  success: boolean
  data?: any
  error?: string
}

type ApiEndpoint = {
  name: string
  icon: React.ReactNode
  description: string
  fields: { name: string; type: string; placeholder: string; required: boolean; options?: string[] }[]
}

const currencyIcons = {
  USDC: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
  SOL: 'https://cryptologos.cc/logos/solana-sol-logo.png',
  MILTON: '/placeholder.svg?height=32&width=32',
  SPL: 'https://cryptologos.cc/logos/solana-sol-logo.png',
}

export default function ApiDemo() {
  const [activeTab, setActiveTab] = useState('blinks')
  const [response, setResponse] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState('USDC')

  const apiEndpoints: Record<string, ApiEndpoint> = useMemo(() => ({
    blinks: {
      name: 'Blinks',
      icon: <Zap className="w-4 h-4 text-yellow-500" />,
      description: 'Create and retrieve instant messages on the blockchain',
      fields: [
        { name: 'text', type: 'text', placeholder: 'Blink text', required: true },
        { name: 'userId', type: 'text', placeholder: 'User ID', required: true },
        { name: 'tags', type: 'text', placeholder: 'Tags (comma-separated)', required: false },
      ],
    },
    transactions: {
      name: 'Transactions',
      icon: <RefreshCcw className="w-4 h-4 text-yellow-500" />,
      description: 'Manage blockchain transactions',
      fields: [
        { name: 'fromAddress', type: 'text', placeholder: 'From Address', required: true },
        { name: 'toAddress', type: 'text', placeholder: 'To Address', required: true },
        { name: 'amount', type: 'number', placeholder: 'Amount', required: true },
        { name: 'currency', type: 'select', placeholder: 'Currency', required: true, options: ['USDC', 'SOL', 'MILTON', 'SPL'] },
        { name: 'memo', type: 'text', placeholder: 'Memo', required: false },
      ],
    },
    payments: {
      name: 'Payments',
      icon: <CreditCard className="w-4 h-4 text-yellow-500" />,
      description: 'Process payments on the Milton platform',
      fields: [
        { name: 'userId', type: 'text', placeholder: 'User ID', required: true },
        { name: 'amount', type: 'number', placeholder: 'Amount', required: true },
        { name: 'currency', type: 'select', placeholder: 'Currency', required: true, options: ['USDC', 'SOL', 'MILTON'] },
        { name: 'description', type: 'text', placeholder: 'Payment Description', required: false },
      ],
    },
    donations: {
      name: 'Donations',
      icon: <Heart className="w-4 h-4 text-yellow-500" />,
      description: 'Manage charitable donations',
      fields: [
        { name: 'donorId', type: 'text', placeholder: 'Donor ID', required: true },
        { name: 'recipientId', type: 'text', placeholder: 'Recipient ID', required: true },
        { name: 'amount', type: 'number', placeholder: 'Amount', required: true },
        { name: 'currency', type: 'select', placeholder: 'Currency', required: true, options: ['USDC', 'SOL', 'MILTON'] },
        { name: 'message', type: 'textarea', placeholder: 'Message (optional)', required: false },
        { name: 'anonymous', type: 'checkbox', placeholder: 'Anonymous Donation', required: false },
      ],
    },
    send: {
      name: 'Send',
      icon: <Coins className="w-4 h-4 text-yellow-500" />,
      description: 'Send USDC, SOL, MILTON, or SPL tokens',
      fields: [
        { name: 'fromAddress', type: 'text', placeholder: 'From Address', required: true },
        { name: 'toAddress', type: 'text', placeholder: 'To Address', required: true },
        { name: 'amount', type: 'number', placeholder: 'Amount', required: true },
        { name: 'currency', type: 'select', placeholder: 'Currency', required: true, options: ['USDC', 'SOL', 'MILTON', 'SPL'] },
        { name: 'tokenAddress', type: 'text', placeholder: 'Token Address (for SPL tokens)', required: false },
        { name: 'memo', type: 'text', placeholder: 'Memo', required: false },
      ],
    },
    governance: {
      name: 'Governance',
      icon: <Vote className="w-4 h-4 text-yellow-500" />,
      description: 'Participate in decentralized decision-making',
      fields: [
        { name: 'action', type: 'select', placeholder: 'Action', required: true, options: ['propose', 'vote', 'execute'] },
        { name: 'title', type: 'text', placeholder: 'Proposal Title', required: true },
        { name: 'description', type: 'textarea', placeholder: 'Proposal Description', required: true },
        { name: 'proposerId', type: 'text', placeholder: 'Proposer ID', required: true },
        { name: 'options', type: 'text', placeholder: 'Options (comma-separated)', required: true },
        { name: 'proposalId', type: 'text', placeholder: 'Proposal ID (for voting/executing)', required: false },
        { name: 'voterId', type: 'text', placeholder: 'Voter ID', required: false },
        { name: 'optionIndex', type: 'number', placeholder: 'Option Index', required: false },
        { name: 'executorId', type: 'text', placeholder: 'Executor ID (for executing)', required: false },
      ],
    },
    gift: {
      name: 'Gift',
      icon: <Gift className="w-4 h-4 text-yellow-500" />,
      description: 'Send and receive gifts on the Milton platform',
      fields: [
        { name: 'senderId', type: 'text', placeholder: 'Sender ID', required: true },
        { name: 'recipientId', type: 'text', placeholder: 'Recipient ID', required: true },
        { name: 'amount', type: 'number', placeholder: 'Amount', required: true },
        { name: 'currency', type: 'select', placeholder: 'Currency', required: true, options: ['USDC', 'SOL', 'MILTON','BARK'] },
        { name: 'message', type: 'textarea', placeholder: 'Gift Message', required: false },
        { name: 'scheduleDate', type: 'date', placeholder: 'Schedule Date', required: false },
      ],
    },
    swap: {
      name: 'Swap',
      icon: <Repeat className="w-4 h-4 text-yellow-500" />,
      description: 'Swap tokens using Jupiter API',
      fields: [
        { name: 'fromAddress', type: 'text', placeholder: 'From Address', required: true },
        { name: 'fromToken', type: 'select', placeholder: 'From Token', required: true, options: ['USDC', 'SOL', 'MILTON', 'BARK'] },
        { name: 'toToken', type: 'select', placeholder: 'To Token', required: true, options: ['USDC', 'SOL', 'MILTON', 'BARK'] },
        { name: 'amount', type: 'number', placeholder: 'Amount', required: true },
        { name: 'slippage', type: 'number', placeholder: 'Slippage (%)', required: true },
      ],
    },
    mint: {
      name: 'Mint',
      icon: <PlusCircle className="w-4 h-4 text-yellow-500" />,
      description: 'Mint new tokens',
      fields: [
        { name: 'toAddress', type: 'text', placeholder: 'To Address', required: true },
        { name: 'amount', type: 'number', placeholder: 'Amount', required: true },
        { name: 'name', type: 'text', placeholder: 'Token Name', required: true },
        { name: 'symbol', type: 'text', placeholder: 'Token Symbol', required: true },
        { name: 'description', type: 'textarea', placeholder: 'Token Description', required: false },
        { name: 'image', type: 'text', placeholder: 'Image URL', required: false },
      ],
    },
  }), [])

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setResponse(null)

    const formData = new FormData(event.currentTarget)
    const endpoint = `/api/${activeTab}`
    const method = formData.get('method') as string
    const body = Object.fromEntries(formData.entries())
    delete body.method

    if (activeTab === 'governance') {
      const action = body.action as string
      delete body.action
      body.options = (body.options as string).split(',').map(option => option.trim())
      const governanceEndpoint = `${endpoint}?action=${action}`
      try {
        const res = await fetch(governanceEndpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        const data = await res.json()
        setResponse({
          success: res.ok,
          data: res.ok ? data : undefined,
          error: !res.ok ? data.error : undefined,
        })
      } catch (error) {
        setResponse({
          success: false,
          error: 'An unexpected error occurred',
        })
      }
    } else {
      try {
        const res = await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        const data = await res.json()
        setResponse({
          success: res.ok,
          data: res.ok ? data : undefined,
          error: !res.ok ? data.error : undefined,
        })
      } catch (error) {
        setResponse({
          success: false,
          error: 'An unexpected error occurred',
        })
      }
    }
    setLoading(false)
  }, [activeTab])

  const renderForm = useCallback(() => {
    const endpoint = apiEndpoints[activeTab]
    return endpoint.fields.map((field) => (
      <div key={field.name} className="space-y-2">
        <Label htmlFor={field.name}>{field.name}</Label>
        {field.type === 'textarea' ? (
          <Textarea
            id={field.name}
            name={field.name}
            placeholder={field.placeholder}
            required={field.required}
          />
        ) : field.type === 'select' ? (
          <select
            id={field.name}
            name={field.name}
            className="w-full p-2 border rounded"
            required={field.required}
            onChange={(e) => field.name === 'currency' && setSelectedCurrency(e.target.value)}
          >
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : field.type === 'checkbox' ? (
          <div className="flex items-center">
            <Input
              type="checkbox"
              id={field.name}
              name={field.name}
              className="mr-2"
            />
            <Label htmlFor={field.name}>{field.placeholder}</Label>
          </div>
        ) : (
          <Input
            type={field.type}
            id={field.name}
            name={field.name}
            placeholder={field.placeholder}
            required={field.required}
          />
        )}
      </div>
    ))
  }, [activeTab, apiEndpoints])

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = `Check out the Milton API Demo for ${apiEndpoints[activeTab].name}!`

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4 text-center">Milton API Demo</h1>
      <p className="text-center mb-8 text-lg text-gray-600">
        Explore and test the Milton blockchain API functionalities
      </p>
      <Alert variant="warning" className="mb-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>MVP Testing Environment</AlertTitle>
        <AlertDescription>
          This is a Minimum Viable Product (MVP) version of the Milton API for testing purposes only. 
          Do not use real credentials or send actual transactions.
        </AlertDescription>
      </Alert>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
          <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted  p-1 text-muted-foreground">
            {Object.entries(apiEndpoints).map(([key, endpoint]) => (
              
              <TabsTrigger
                key={key}
                value={key}
                className="inline-flex  items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                <div className="flex items-center space-x-2">
                  {endpoint.icon}
                  <span>{endpoint.name}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {apiEndpoints[activeTab].icon}
                <span>{apiEndpoints[activeTab].name} API</span>
                {activeTab === 'send' && (
                  <Image
                    src={currencyIcons[selectedCurrency as keyof typeof currencyIcons]}
                    alt={selectedCurrency}
                    width={24}
                    height={24}
                  />
                )}
              </CardTitle>
              <CardDescription>{apiEndpoints[activeTab].description}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="method">Method</Label>
                  <select name="method" id="method" className="w-full p-2 border rounded">
                    <option value="POST">POST</option>
                    <option value="GET">GET</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>
                {renderForm()}
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Send className="mr-2 h-4 w-4 animate-spin text-yellow-500" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4 text-yellow-500" />
                      Send Request
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col items-end space-y-4">
              {response && (
                <Alert variant={response.success ? "default" : "destructive"}>
                  {response.success ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertTitle>{response.success ? "Success" : "Error"}</AlertTitle>
                  <AlertDescription>
                    <pre className="mt-2 w-full max-w-xs overflow-x-scroll">
                      {JSON.stringify(response.success ? response.data : response.error, null, 2)}
                    </pre>
                  </AlertDescription>
                </Alert>
              )}
              <div className="flex items-center space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => window.open('https://docs.miltonprotocol.com/api', '_blank')}>
                        <BookOpen className="h-4 w-4 text-yellow-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>API Documentation</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => window.open(`https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share on X</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share on Facebook</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`, '_blank')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share on LinkedIn</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => window.open(`https://discord.com/share?url=${encodeURIComponent(shareUrl)}`, '_blank')}>
                        <Discord className="h-4 w-4 text-yellow-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share on Discord</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank')}>
                        <Telegram className="h-4 w-4 text-yellow-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share on Telegram</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}