'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Wallet, Coins, Zap, Users, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const steps = [
  {
    title: "Connect Your Wallet",
    description: "Link your Solana wallet to start using Milton's features.",
    icon: Wallet,
    content: "To begin, connect your Solana wallet. We support popular wallets like Phantom, Solflare, and more. Click the 'Connect Wallet' button in the top right corner of the page to get started."
  },
  {
    title: "Get MILTON Tokens",
    description: "Acquire MILTON tokens to participate in the ecosystem.",
    icon: Coins,
    content: "You can obtain MILTON tokens through our token sale, airdrops, or by swapping other cryptocurrencies. Visit our 'Buy' page to purchase MILTON tokens directly."
  },
  {
    title: "Explore Features",
    description: "Discover the various features and services Milton offers.",
    icon: Zap,
    content: "Milton offers a range of features including staking, NFT minting, and participation in community governance. Explore our platform to find the services that interest you most."
  },
  {
    title: "Join the Community",
    description: "Become part of the vibrant Milton community.",
    icon: Users,
    content: "Engage with other Milton users, participate in discussions, and stay updated on the latest developments. Join our Discord server and follow us on social media to get involved."
  }
]

export default function GetStartedPage() {
  const [activeTab, setActiveTab] = useState("connect")

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Get Started with Milton</h1>
      <p className="text-xl text-center mb-12 text-muted-foreground">
        Follow these simple steps to begin your journey in the Milton ecosystem
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <TabsTrigger key={index} value={step.title.toLowerCase().replace(/\s+/g, '-')}>
              <step.icon className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">{step.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        {steps.map((step, index) => (
          <TabsContent key={index} value={step.title.toLowerCase().replace(/\s+/g, '-')}>
            <Card>
              <CardHeader>
                <CardTitle>{step.title}</CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{step.content}</p>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href={`/${step.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-16 text-center"
      >
        <h2 className="text-2xl font-semibold mb-4">Ready to dive in?</h2>
        <Button size="lg" asChild>
          <Link href="/dashboard">
            Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </motion.div>
    </div>
  )
}