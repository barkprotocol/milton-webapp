'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Wallet, Send, Gift, Shuffle } from 'lucide-react'
import Link from 'next/link'

const steps = [
  {
    title: "Connect Your Wallet",
    description: "Link your Solana wallet to access MILTON's features.",
    icon: <Wallet className="h-6 w-6" />,
  },
  {
    title: "Send Blinks",
    description: "Instantly transfer MILTON tokens to other users.",
    icon: <Send className="h-6 w-6" />,
  },
  {
    title: "Gift MILTON",
    description: "Send MILTON as a gift with a personalized message.",
    icon: <Gift className="h-6 w-6" />,
  },
  {
    title: "Swap Tokens",
    description: "Exchange MILTON for other supported tokens.",
    icon: <Shuffle className="h-6 w-6" />,
  },
]

export function HowToUse() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-gray-200">
          How to Use MILTON
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                    {step.icon}
                  </div>
                  <CardTitle>{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{step.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/blinkboard" passHref>
            <Button size="lg" className="group">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}