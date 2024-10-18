import React from 'react'
import { TokenomicsCard } from '@/components/ui/tokenomics-card'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'

export function TokenomicsSection() {
  const tokenomicsData = [
    { title: "Total Supply", value: "1,000,000,000 MILTON" },
    { title: "Circulating Supply", value: "500,000,000 MILTON" },
    { title: "Market Cap", value: "$10,000,000" },
    { title: "Holders", value: "10,000+" }
  ]

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-sand-50 to-sand-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-4 text-sm font-semibold px-3 py-1 bg-primary text-primary-foreground">
              Tokenomics
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              MILTON Token Metrics
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the key metrics behind the MILTON token ecosystem and its current market status.
            </p>
          </motion.div>
        </div>
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {tokenomicsData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <TokenomicsCard 
                title={item.title} 
                value={item.value} 
                className="h-full flex flex-col justify-between bg-white shadow-lg rounded-lg p-6 transition-all duration-300 hover:shadow-xl"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}