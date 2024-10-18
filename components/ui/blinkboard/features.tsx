'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'
import { FeatureCard } from '../feature-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function Features() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null)

  const features = [
    {
      icon: 'ri-flashlight-line',
      title: "Instant Blink Creation",
      description: "Create and share Blinks in seconds for various blockchain activities.",
      details: "Our intuitive interface allows you to generate Blinks for crowdfunding, token swaps, donations, and NFT sales with just a few clicks.",
      useCase: "Perfect for project creators looking to quickly set up fundraising campaigns or artists wanting to launch NFT collections without complex setups."
    },
    {
      icon: 'ri-group-line',
      title: "Community-Driven Ecosystem",
      description: "Engage with a vibrant community of Blink creators and supporters.",
      details: "Blinkboard fosters a collaborative environment where users can discover, support, and participate in various blockchain initiatives.",
      useCase: "Ideal for community managers looking to build engagement around their projects or individuals seeking to support causes they care about."
    },
    {
      icon: 'ri-secure-payment-line',
      title: "Secure Transactions",
      description: "Enjoy peace of mind with our robust security measures for all Blink transactions.",
      details: "Blinkboard leverages Solana's fast and secure blockchain to ensure all transactions are protected and transparent.",
      useCase: "Essential for users who prioritize security in their blockchain interactions, from small donations to large token swaps."
    },
    {
      icon: 'ri-pie-chart-line',
      title: "Analytics Dashboard",
      description: "Track the performance of your Blinks with detailed analytics.",
      details: "Get insights into your Blinks' engagement, transaction volumes, and supporter demographics to optimize your campaigns.",
      useCase: "Valuable for project managers and marketers who need data-driven insights to improve their blockchain initiatives."
    },
    {
      icon: 'ri-wallet-3-line',
      title: "Multi-Wallet Support",
      description: "Connect and manage multiple wallets for seamless Blink interactions.",
      details: "Blinkboard supports various Solana wallets, allowing you to easily switch between accounts or manage different projects.",
      useCase: "Great for power users managing multiple projects or for teams collaborating on various blockchain initiatives."
    },
    {
      icon: 'ri-global-line',
      title: "Cross-Platform Compatibility",
      description: "Create and share Blinks across different platforms and social media.",
      details: "Blinkboard generates shareable links and embeddable widgets, making it easy to spread your Blinks across the web.",
      useCase: "Perfect for content creators and marketers looking to maximize the reach of their blockchain projects across various online channels."
    }
  ]

  const handleHover = useCallback((index: number | null) => {
    setHoveredIndex(index)
  }, [])

  const handleFeatureClick = useCallback((index: number) => {
    setSelectedFeature(index === selectedFeature ? null : index)
  }, [selectedFeature])

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-gray-50 to-white w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center items-center mb-4">
            <Badge variant="secondary" className="text-sm font-semibold px-3 py-1 bg-primary text-primary-foreground">
              Features
            </Badge>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Revolutionize Your Blockchain Experience
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how Blinkboard simplifies blockchain interactions, making it easy for anyone to create, manage, and engage with various blockchain activities through our innovative Blink system.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <FeatureCard
                icon={<Icon icon={feature.icon} className="w-8 h-8 text-primary" aria-hidden="true" />}
                title={feature.title}
                description={feature.description}
                isHovered={hoveredIndex === index}
                isSelected={selectedFeature === index}
                onMouseEnter={() => handleHover(index)}
                onMouseLeave={() => handleHover(null)}
                onClick={() => handleFeatureClick(index)}
              />
            </motion.div>
          ))}
        </div>
        <AnimatePresence>
          {selectedFeature !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-8"
            >
              <Card className="bg-white shadow-lg border-primary/10">
                <CardHeader className="bg-primary/5">
                  <CardTitle className="text-2xl font-bold text-primary">{features[selectedFeature].title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-700 mb-4 text-lg">{features[selectedFeature].details}</p>
                  <h3 className="text-xl font-semibold mb-2 text-primary">Use Case:</h3>
                  <p className="text-gray-700 mb-6 text-lg">{features[selectedFeature].useCase}</p>
                  <Button onClick={() => handleFeatureClick(selectedFeature)} variant="outline" className="w-full sm:w-auto">
                    Close
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}