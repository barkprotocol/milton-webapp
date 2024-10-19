'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Zap, Heart, Shield, Globe, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from '@/components/ui/badge'

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

export function About() {
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
              alt="Milton Ecosystem Illustration"
              width={500}
              height={300}
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