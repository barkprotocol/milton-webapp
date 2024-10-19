'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Coins, Zap, Users, Shield, Rocket, ArrowRight, Gem, ExternalLink, Heart, Globe } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from '@/components/ui/badge'

const features = [
  {
    title: "MILTON Tokens",
    description: "The native cryptocurrency of our ecosystem",
    icon: Coins,
    content: "MILTON tokens are the backbone of our platform. They can be used for transactions, staking, governance, and accessing premium features. Learn about tokenomics, distribution, and utility.",
    iconColor: "text-yellow-500"
  },
  {
    title: "DeFi Solutions",
    description: "Innovative decentralized finance products",
    icon: Zap,
    content: "Explore our range of DeFi solutions including yield farming, liquidity pools, and automated market making. Discover how Milton is pushing the boundaries of decentralized finance.",
    iconColor: "text-yellow-500"
  },
  {
    title: "Community Governance",
    description: "Participate in shaping Milton's future",
    icon: Users,
    content: "As a MILTON token holder, you have a say in the platform's development. Learn about our governance model, proposal system, and how you can contribute to decision-making.",
    iconColor: "text-yellow-500"
  },
  {
    title: "Security Measures",
    description: "Keeping your assets safe",
    icon: Shield,
    content: "Security is our top priority. Understand the measures we've implemented to protect user funds, including smart contract audits, bug bounties, and insurance funds.",
    iconColor: "text-yellow-500"
  },
  {
    title: "Roadmap",
    description: "Our vision for the future",
    icon: Rocket,
    content: "Get a glimpse of what's coming next for Milton. Our roadmap outlines upcoming features, partnerships, and milestones we're working towards.",
    iconColor: "text-yellow-500"
  },
  {
    title: "NFT Marketplace",
    description: "Explore and trade unique digital assets",
    icon: Gem,
    content: "Dive into the world of NFTs with Milton's integrated marketplace. Create, buy, sell, and trade unique digital assets backed by blockchain technology.",
    iconColor: "text-yellow-500"
  }
]

const faqs = [
  {
    question: "What is Milton?",
    answer: "Milton is a decentralized finance (DeFi) platform built on the Solana blockchain. It offers a range of financial services and products, including token swaps, yield farming, and community governance."
  },
  {
    question: "How do I get started with Milton?",
    answer: "To get started, you'll need a Solana wallet (like Phantom or Solflare) and some SOL tokens. Connect your wallet to our platform, acquire some MILTON tokens, and you're ready to explore our features!"
  },
  {
    question: "What are MILTON tokens used for?",
    answer: "MILTON tokens are the native cryptocurrency of our ecosystem. They're used for transactions, staking, participating in governance, and accessing premium features on our platform."
  },
  {
    question: "Is Milton secure?",
    answer: "Security is our top priority. We employ rigorous security measures, including regular smart contract audits, bug bounty programs, and insurance funds. However, as with all DeFi platforms, users should exercise caution and do their own research."
  },
  {
    question: "How can I participate in governance?",
    answer: "MILTON token holders can participate in governance by voting on proposals and submitting their own ideas for platform improvements. Check out our Governance page for more details."
  }
]

function About() {
  const features = [
    {
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      title: "Lightning-Fast Blinks",
      description: "Create and send Blinks instantly on the Solana blockchain for various actions."
    },
    {
      icon: <Heart className="h-6 w-6 text-yellow-500" />,
      title: "Social Finance & Charity",
      description: "Combine financial growth with charitable giving and disaster relief efforts."
    },
    {
      icon: <Shield className="h-6 w-6 text-yellow-500" />,
      title: "Secure Platform",
      description: "Enjoy peace of mind with our robust security measures on the Solana network."
    },
    {
      icon: <Globe className="h-6 w-6 text-yellow-500" />,
      title: "Global Impact",
      description: "Make a difference worldwide through donations and social finance initiatives."
    }
  ]

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-secondary/10 to-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-4 text-sm font-semibold px-3 py-1 bg-primary text-primary-foreground">
              About Milton
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Empowering Change Through Blinks
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover how Milton is reshaping the landscape of social finance, blending the power of Solana with charitable giving and disaster relief.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Image
              src="https://ucarecdn.com/137628fb-f546-490c-887a-1d0d3177f542/MiltonCard.png"
              alt="Milton Platform Illustration"
              width={600}
              height={400}
              className="rounded-lg shadow-xl"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
            <p className="text-lg mb-6">
              Milton is a groundbreaking platform that harnesses the speed and efficiency of Solana to revolutionize social finance and charitable giving. We've created a unique ecosystem where financial growth and social impact coexist harmoniously.
            </p>
            <p className="text-lg mb-8">
              Through our innovative Blink system, users can instantly create and send actions for various purposes - from donations and disaster relief to investment in social causes. Each Blink represents a step towards a better world, powered by the Solana blockchain.
            </p>
            <Button size="lg" className="group">
              Explore Our Impact
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="mb-4">{feature.icon}</div>
                  <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function LearnMorePage() {
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-primary">
            Discover Milton
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore the features, benefits, and vision behind Milton's revolutionary decentralized finance ecosystem
          </p>
        </motion.div>

        <Tabs defaultValue="about" className="mb-16">
          <TabsList className="w-full max-w-2xl mx-auto bg-secondary/20 p-1 rounded-full flex justify-center">
            <TabsTrigger value="about" className="rounded-full transition-all duration-300">About</TabsTrigger>
            <TabsTrigger value="features" className="rounded-full transition-all duration-300">Features</TabsTrigger>
            <TabsTrigger value="faq" className="rounded-full transition-all duration-300">FAQ</TabsTrigger>
          </TabsList>
          <TabsContent value="about">
            <About />
          </TabsContent>
          <TabsContent value="features">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 bg-secondary/5 border-none">
                    <CardHeader>
                      <div className="bg-primary/10 p-3 rounded-full inline-block mb-4">
                        <feature.icon className={`h-6 w-6 ${feature.iconColor || 'text-muted-foreground'}`} />
                      </div>
                      <CardTitle className="text-primary">{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-muted-foreground">{feature.content}</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full hover:bg-primary hover:text-primary-foreground" onClick={() => setExpandedFeature(expandedFeature === feature.title ? null : feature.title)}>
                        {expandedFeature === feature.title ? 'Less Info' : 'More Info'}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="faq">
            <Card className="w-full max-w-3xl mx-auto bg-secondary/5 border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border-b border-secondary/20">
                      <AccordionTrigger className="text-lg font-medium text-primary hover:text-primary/80">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center bg-primary/5 p-8 rounded-lg shadow-inner"
        >
          <h2 className="text-2xl font-semibold mb-4 text-primary">Ready to join the Milton ecosystem?</h2>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/pages/get-started">
                Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Link href="/pages/docs">
                Read Documentation <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}