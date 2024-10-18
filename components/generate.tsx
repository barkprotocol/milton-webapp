'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import Image from 'next/image'

interface GenerateProps {
  onSubmit: (e: React.FormEvent) => Promise<void>
  isLoading: boolean
  progress: number
  amount: string
  setAmount: (amount: string) => void
  selectedToken: string
  setSelectedToken: (token: string) => void
  currencies: { value: string; icon: string; label: string }[]
}

export function Generate({
  onSubmit,
  isLoading,
  progress,
  amount,
  setAmount,
  selectedToken,
  setSelectedToken,
  currencies
}: GenerateProps) {
  const [activeTab, setActiveTab] = useState('nft')

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="nft">Generate NFT</TabsTrigger>
        <TabsTrigger value="token">Generate Token</TabsTrigger>
      </TabsList>
      <TabsContent value="nft">
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="NFT Name"
            required
            className="w-full bg-gray-600 text-white border-gray-500 focus:border-[#FFECB1] focus:ring-[#FFECB1]"
          />
          <Textarea
            placeholder="NFT Description"
            required
            className="w-full bg-gray-600 text-white border-gray-500 focus:border-[#FFECB1] focus:ring-[#FFECB1]"
          />
          <Input
            type="url"
            placeholder="Image URL"
            required
            className="w-full bg-gray-600 text-white border-gray-500 focus:border-[#FFECB1] focus:ring-[#FFECB1]"
          />
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
              placeholder={`Price (${selectedToken})`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="flex-1 bg-gray-600 text-white border-gray-500 focus:border-[#FFECB1] focus:ring-[#FFECB1]"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-[#FFECB1] hover:bg-[#FFE49A] text-gray-900 font-semibold transition-colors duration-200" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Sparkles className="mr-2 h-5 w-5 animate-spin text-gray-900" />
                Generating NFT...
              </>
            ) : (
              <>
                Generate NFT
                <ArrowRight className="ml-2 h-5 w-5 text-gray-900" />
              </>
            )}
          </Button>
        </form>
      </TabsContent>
      <TabsContent value="token">
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Token Name"
            required
            className="w-full bg-gray-600 text-white border-gray-500 focus:border-[#FFECB1] focus:ring-[#FFECB1]"
          />
          <Input
            type="text"
            placeholder="Token Symbol"
            required
            className="w-full bg-gray-600 text-white border-gray-500 focus:border-[#FFECB1] focus:ring-[#FFECB1]"
          />
          <Input
            type="number"
            placeholder="Total Supply"
            required
            className="w-full bg-gray-600 text-white border-gray-500 focus:border-[#FFECB1] focus:ring-[#FFECB1]"
          />
          <Textarea
            placeholder="Token Description"
            required
            className="w-full bg-gray-600 text-white border-gray-500 focus:border-[#FFECB1] focus:ring-[#FFECB1]"
          />
          <Button 
            type="submit" 
            className="w-full bg-[#FFECB1] hover:bg-[#FFE49A] text-gray-900 font-semibold transition-colors duration-200" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Sparkles className="mr-2 h-5 w-5 animate-spin text-gray-900" />
                Generating Token...
              </>
            ) : (
              <>
                Generate Token
                <ArrowRight className="ml-2 h-5 w-5 text-gray-900" />
              </>
            )}
          </Button>
        </form>
      </TabsContent>
      {isLoading && <Progress value={progress} className="w-full mt-4" />}
    </Tabs>
  )
}