'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowRight, Zap, DollarSign, Gift, Repeat, Image as ImageIcon, Coins, Users, Sparkles, Send, ShoppingCart, Info, AlertTriangle, X } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Progress } from '@/components/ui/progress'
import { Generate } from '@/components/generate'
import { toast } from '@/components/ui/use-toast'
import Image from 'next/image'

interface Transaction {
  type: string
  amount: string
  token: string
  timestamp: string
}

interface TabInfo {
  value: string
  icon: React.ElementType
  label: string
  description: string
}

interface Currency {
  value: string
  icon: string
  label: string
}

export function ExperienceBlinkboard() {
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedToken, setSelectedToken] = useState('SOL')
  const [activeTab, setActiveTab] = useState('crowdfunding')
  const [progress, setProgress] = useState(0)
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [isInfoOpen, setIsInfoOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setProgress(0)
    try {
      // Simulate API call with progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200))
        setProgress(i)
      }
      toast({
        title: "Action Completed",
        description: `Your ${activeTab} request has been successfully processed!`,
      })
      console.log('Submitted amount:', amount)
      setRecentTransactions(prev => [
        { type: activeTab, amount, token: selectedToken, timestamp: new Date().toISOString() },
        ...prev.slice(0, 4)
      ])
      setAmount('')
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while processing your request.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setProgress(0)
    }
  }

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value)
    setAmount('')
  }, [])

  const tabs: TabInfo[] = [
    { value: 'crowdfunding', icon: Zap, label: 'Crowdfunding', description: 'Create a crowdfunding campaign to raise funds for your project.' },
    { value: 'tokenswap', icon: Repeat, label: 'Token Swap', description: 'Exchange one type of token for another at current market rates.' },
    { value: 'donation', icon: Gift, label: 'Donation', description: 'Set up a donation campaign to receive contributions for your cause.' },
    { value: 'generate', icon: ImageIcon, label: 'Generate', description: 'Create and mint unique NFTs or generate custom tokens.' },
    { value: 'governance', icon: Users, label: 'Governance', description: 'Participate in decentralized decision-making processes.' },
    { value: 'send', icon: Send, label: 'Send', description: 'Transfer tokens to other wallet addresses.' },
    { value: 'tokensale', icon: DollarSign, label: 'Token Sale', description: 'Conduct an Initial Coin Offering (ICO) or token sale event.' },
    { value: 'buymilton', icon: ShoppingCart, label: 'Buy Milton', description: 'Purchase Milton tokens, the native currency of our platform.' },
  ]

  const currencies: Currency[] = [
    { value: 'SOL', icon: 'https://ucarecdn.com/8bcc4664-01b2-4a88-85bc-9ebce234f08b/sol.png', label: 'SOL' },
    { value: 'USDC', icon: 'https://ucarecdn.com/67e17a97-f3bd-46c0-8627-e13b8b939d26/usdc.png', label: 'USDC' },
    { value: 'MILTON', icon: 'https://ucarecdn.com/fe802b60-cb87-4adc-8e1d-1b16a05f9420/miltonlogoicon.svg', label: 'MILTON' },
    { value: 'BARK', icon: 'https://ucarecdn.com/8aa0180d-1112-4aea-8210-55b266c3fb44/bark.png', label: 'BARK' },
  ]

  useEffect(() => {
    const warningTimeout = setTimeout(() => {
      toast({
        title: "Reminder",
        description: "Don't forget to complete your transaction!",
        duration: 5000,
      })
    }, 60000) // 1 minute

    return () => clearTimeout(warningTimeout)
  }, [activeTab])

  return (
    <section className="py-8 md:py-16 bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-50">Applications</h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">Explore the simplicity and power of creating Blinks, mint NFTs, tokens or buy SPL tokens, send for various purposes.</p>
        </motion.div>
        <Card className="w-full shadow-lg bg-gray-800 border-gray-700">
          <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-600 rounded-t-lg">
            <CardTitle className="text-2xl md:text-3xl text-center text-gray-100">Create a Blink</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 bg-gradient-to-b from-gray-800 to-gray-700">
            <Tabs defaultValue="crowdfunding" className="space-y-6" onValueChange={handleTabChange}>
              <TabsList className="grid grid-cols-4 sm:grid-cols-8 gap-1 rounded-lg bg-gray-700 p-1">
                {tabs.map(({ value, icon: Icon, label }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className="rounded-md data-[state=active]:bg-gray-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-200 hover:bg-gray-600/50 px-2 py-2 text-xs sm:text-sm font-medium"
                  >
                    <Icon className="w-4 h-4 mr-1 text-[#FFECB1]" />
                    <span className="hidden sm:inline">{label}</span>
                    <span className="sm:hidden">{label.split(' ')[0]}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              <AnimatePresence mode="wait">
                {tabs.map((tab) => (
                  <TabsContent key={tab.value} value={tab.value}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gray-700 rounded-lg p-4 shadow-md"
                    >
                      {tab.value === 'generate' ? (
                        <Generate
                          onSubmit={handleSubmit}
                          isLoading={isLoading}
                          progress={progress}
                          amount={amount}
                          setAmount={setAmount}
                          selectedToken={selectedToken}
                          setSelectedToken={setSelectedToken}
                          currencies={currencies}
                        />
                      ) : (
                        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
                          {tab.value === 'buymilton' ? (
                            <>
                              <div className="flex items-center space-x-2">
                                <Image src="/images/milton-icon.png" alt="Milton" width={24} height={24} />
                                <Input
                                  type="number"
                                  placeholder="Amount of Milton to buy"
                                  value={amount}
                                  onChange={(e) => setAmount(e.target.value)}
                                  required
                                  className="w-full bg-gray-600 text-white border-gray-500 focus:border-[#FFECB1] focus:ring-[#FFECB1]"
                                />
                              </div>
                              <Select>
                                <SelectTrigger className="w-full bg-gray-600 text-white border-gray-500 focus:border-[#FFECB1] focus:ring-[#FFECB1]">
                                  <SelectValue placeholder="Payment Method" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-600 text-white border-gray-500">
                                  {currencies.map((currency) => (
                                    <SelectItem key={currency.value} value={currency.value}>
                                      <div className="flex items-center">
                                        <Image src={currency.icon} alt={currency.label} width={20} height={20} className="mr-2" />
                                        {currency.label}
                                      </div>
                                    </SelectItem>
                                  ))}
                                  <SelectItem value="credit">Credit Card</SelectItem>
                                </SelectContent>
                              </Select>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center space-x-2">
                                <Input
                                  type="text"
                                  placeholder={tab.value === 'send' ? "Recipient Address" : `${tab.label} Name`}
                                  required
                                  className="w-full bg-gray-600 text-white border-gray-500 focus:border-[#FFECB1] focus:ring-[#FFECB1]"
                                />
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" className="text-[#FFECB1]">
                                        <Info className="h-4 w-4" />
                                        <span className="sr-only">More information</span>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Enter the {tab.value === 'send' ? "recipient's wallet address" : `name for your ${tab.label}`}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                              {tab.value !== 'governance' && (
                                <div className="flex items-center space-x-2">
                                  <Select onValueChange={setSelectedToken}>
                                    <SelectTrigger className="w-32 bg-gray-600 text-white border-gray-500 focus:border-[#FFECB1] focus:ring-[#FFECB1]">
                                      <SelectValue placeholder="Token" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-600 text-white border-gray-500">
                                      {currencies.map((currency) => (
                                        <SelectItem key={currency.value} value={currency.value}>
                                          <div className="flex items-center">
                                            <Image src={currency.icon} alt={currency.label} width={20} height={20} className="mr-2" />
                                            {currency.label}
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <Input
                                    type="number"
                                    placeholder={`Amount (${selectedToken})`}
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                    className="flex-1 bg-gray-600 text-white border-gray-500 focus:border-[#FFECB1] focus:ring-[#FFECB1]"
                                  />
                                </div>
                              )}
                              {tab.value === 'governance' && (
                                <Textarea
                                  placeholder="Proposal Description"
                                  required
                                  className="w-full bg-gray-600 text-white border-gray-500 focus:border-[#FFECB1] focus:ring-[#FFECB1]"
                                />
                              )}
                            </>
                          )}
                          <Button 
                            type="submit" 
                            className="w-full bg-[#FFECB1] hover:bg-[#FFE49A] text-gray-900 font-semibold transition-colors duration-200 py-2 h-auto" 
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <Sparkles className="mr-2 h-5 w-5 animate-spin text-gray-900" />
                                Processing...
                              </>
                            ) : (
                              <>
                                {tab.value === 'buymilton' ? 'Buy Milton' : `Create ${tab.label} Blink`}
                                <ArrowRight className="ml-2 h-5 w-5 text-gray-900" />
                              </>
                            )}
                          </Button>
                          {isLoading && <Progress value={progress} className="w-full mt-2" />}
                        
                        </form>
                      )}
                      <Button
                        onClick={() => setIsInfoOpen(true)}
                        className="mt-4 w-full bg-gray-600 hover:bg-gray-500 text-white py-2 h-auto"
                      >
                        <Info className="mr-2 h-5 w-5" />
                        More Information
                      </Button>
                    </motion.div>
                  </TabsContent>
                ))}
              </AnimatePresence>
            </Tabs>
            {recentTransactions.length > 0 && (
              <div className="mt-8 bg-gray-800 rounded-lg p-4 shadow-md">
                <h3 className="text-xl font-semibold text-gray-200 mb-4">Recent Transactions</h3>
                <ul className="space-y-2">
                  {recentTransactions.map((tx, index) => (
                    <li key={index} className="bg-gray-700 rounded-md p-3 text-sm text-gray-300 flex justify-between items-center">
                      <span>{tx.type} - {tx.amount} {tx.token}</span>
                      <span className="text-gray-400 text-xs">{new Date(tx.timestamp).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {isInfoOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-xl border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-100">{tabs.find(t => t.value === activeTab)?.label}</h3>
              <Button onClick={() => setIsInfoOpen(false)} variant="ghost" size="icon">
                <X className="h-6 w-6 text-gray-400" />
              </Button>
            </div>
            <p className="text-gray-300 mb-4">{tabs.find(t => t.value === activeTab)?.description}</p>
            <h4 className="text-xl font-semibold text-gray-200 mt-4">Features:</h4>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li>Easy-to-use form interface</li>
              <li>Support for multiple currencies</li>
              <li>Real-time transaction processing</li>
              <li>Progress indicator during submission</li>
              <li>Recent transaction history</li>
            </ul>
            <h4 className="text-xl font-semibold text-gray-200 mt-4">How to use:</h4>
            <ol className="list-decimal list-inside text-gray-300 space-y-2">
              <li>Fill in the required information</li>
              <li>Choose your preferred token (if applicable)</li>
              <li>Enter the amount</li>
              <li>Click the "Create {tabs.find(t => t.value === activeTab)?.label} Blink" button</li>
              <li>Wait for the transaction to process</li>
              <li>View your recent transaction in the history section</li>
            </ol>
          </div>
        </div>
      )}
    </section>
  )
}