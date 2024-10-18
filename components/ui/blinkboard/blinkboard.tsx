'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, Users, Heart, Globe, PlusCircle, Coins, Repeat, Image as ImageIcon, Share2 } from 'lucide-react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Link from 'next/link'

export function About() {
  const [isHovered, setIsHovered] = useState(false)
  const [activeFeature, setActiveFeature] = useState<number | null>(null)

  const features = [
    { 
      title: "Create Blinks", 
      description: "Easily create and share Blinks for various use cases", 
      details: "Our intuitive interface allows you to generate Blinks for crowdfunding, token swaps, donations, and NFT sales with just a few clicks.",
      icon: PlusCircle
    },
    { 
      title: "Crowd Funding", 
      description: "Launch instant crowdfunding campaigns", 
      details: "Set up and manage crowdfunding campaigns quickly and efficiently, reaching a global audience of potential backers.",
      icon: Users
    },
    { 
      title: "Donations", 
      description: "Facilitate effortless donations on-chain", 
      details: "Enable seamless, transparent, and secure donations for various causes, leveraging the power of blockchain technology.",
      icon: Heart
    },
    { 
      title: "Token Swaps", 
      description: "Streamline token exchange processes", 
      details: "Create user-friendly interfaces for token swaps, making it easy for users to exchange different cryptocurrencies.",
      icon: Repeat
    },
    { 
      title: "NFT Sales", 
      description: "Streamline NFT sales and marketplace interactions", 
      details: "Simplify the process of minting, selling, and trading NFTs, opening up new possibilities for digital artists and collectors.",
      icon: ImageIcon
    },
    { 
      title: "Social Integration", 
      description: "Enhance blockchain interactions with social features", 
      details: "Integrate social elements into your Blinks, fostering community engagement and viral spread of your blockchain initiatives.",
      icon: Share2
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            About Blinkboard
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Revolutionizing blockchain interactions with simplicity and speed
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Image
              src="/placeholder.svg?height=500&width=500"
              alt="Blinkboard Platform Illustration"
              width={500}
              height={500}
              className="rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105"
            />
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-primary bg-opacity-75 rounded-lg flex items-center justify-center"
                >
                  <p className="text-white text-2xl font-bold">Simplify Your Blockchain Experience!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-gray-900">
              The Future of Blockchain Interaction
            </h3>
            <p className="text-lg text-gray-600">
              Blinkboard is not just another blockchain platform; it's a revolution in how we interact with decentralized technologies. Built on the lightning-fast Solana network, Blinkboard combines the power of blockchain with unparalleled user experience.
            </p>
            <p className="text-lg text-gray-600">
              Our mission is to create an ecosystem where complexity meets simplicity, enabling anyone to harness the full potential of blockchain technology without the steep learning curve.
            </p>
          </motion.div>
        </div>

        <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Key Features
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer h-full"
              onClick={() => setActiveFeature(activeFeature === index ? null : index)}
            >
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-semibold text-primary">
                  <feature.icon className="h-6 w-6 mr-2" />
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 mb-4">{feature.description}</CardDescription>
                <AnimatePresence>
                  {activeFeature === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-sm text-gray-500">{feature.details}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/solutions" passHref>
            <Button className="bg-primary hover:bg-primary/90 text-white group transition-all duration-300 ease-in-out transform hover:scale-105">
              Explore Our Solutions 
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}