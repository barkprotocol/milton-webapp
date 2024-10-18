'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowRight, Zap, DollarSign, Gift, Repeat, Image as ImageIcon, Coins, Users, Send, ShoppingCart } from 'lucide-react'

export function BlinkboardInfo() {
  const tabs = [
    { value: 'crowdfunding', icon: Zap, label: 'Crowdfunding', description: 'Create a crowdfunding campaign to raise funds for your project.' },
    { value: 'tokenswap', icon: Repeat, label: 'Token Swap', description: 'Exchange one type of token for another at current market rates.' },
    { value: 'donation', icon: Gift, label: 'Donation', description: 'Set up a donation campaign to receive contributions for your cause.' },
    { value: 'nft', icon: ImageIcon, label: 'Generate NFT', description: 'Create and mint unique Non-Fungible Tokens (NFTs).' },
    { value: 'token', icon: Coins, label: 'Generate Token', description: 'Create your own custom token on the blockchain.' },
    { value: 'governance', icon: Users, label: 'Governance', description: 'Participate in decentralized decision-making processes.' },
    { value: 'send', icon: Send, label: 'Send', description: 'Transfer tokens to other wallet addresses.' },
    { value: 'tokensale', icon: DollarSign, label: 'Token Sale', description: 'Conduct an Initial Coin Offering (ICO) or token sale event.' },
    { value: 'buymilton', icon: ShoppingCart, label: 'Buy Milton', description: 'Purchase Milton tokens, the native currency of our platform.' },
  ]

  return (
    <Card className="w-full shadow-lg bg-gray-800 border-gray-700">
      <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-600 rounded-t-lg">
        <CardTitle className="text-3xl text-center text-gray-100">Blinkboard Features</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="crowdfunding" className="space-y-6">
          <TabsList className="flex flex-wrap justify-center gap-1 rounded-lg bg-gray-700 p-1">
            {tabs.map(({ value, icon: Icon, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="flex-1 rounded-md data-[state=active]:bg-gray-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-200 hover:bg-gray-600/50 px-2 py-1 text-xs sm:text-sm"
              >
                <Icon className="w-4 h-4 mr-1 text-[#FFECB1]" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{label.split(' ')[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-100">{tab.label}</h3>
              <p className="text-gray-300">{tab.description}</p>
              <h4 className="text-xl font-semibold text-gray-200 mt-4">Features:</h4>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Easy-to-use form interface</li>
                <li>Support for multiple currencies</li>
                <li>Real-time transaction processing</li>
                <li>Progress indicator during submission</li>
                <li>Recent transaction history</li>
              </ul>
              <h4 className="text-xl font-semibold text-gray-200 mt-4">How to use:</h4>
              <ol className="list-decimal list-inside text-gray-300 space-y-2">
                <li>Select the {tab.label} tab</li>
                <li>Fill in the required information</li>
                <li>Choose your preferred token (if applicable)</li>
                <li>Enter the amount</li>
                <li>Click the "Create {tab.label} Blink" button</li>
                <li>Wait for the transaction to process</li>
                <li>View your recent transaction in the history section</li>
              </ol>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}