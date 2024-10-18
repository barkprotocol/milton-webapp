'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Lightbulb, Rocket, Users, Zap } from 'lucide-react'

export function Story() {
  const storyPoints = [
    {
      icon: Lightbulb,
      title: "The Idea",
      content: "It all started with a simple idea: what if we could combine the power of memes with the potential of blockchain technology?"
    },
    {
      icon: Rocket,
      title: "The Launch",
      content: "On a fateful day, Milton Token was born, unleashing a tornado of memes and innovation onto the Solana blockchain."
    },
    {
      icon: Users,
      title: "Community Growth",
      content: "As word spread, meme enthusiasts and crypto lovers alike flocked to join the Milton revolution, forming a vibrant and creative community."
    },
    {
      icon: Zap,
      title: "The Future",
      content: "With lightning-fast transactions and an ever-growing ecosystem, Milton is set to redefine the landscape of meme culture and decentralized finance."
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
            The Milton Story
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From meme to dream: How Milton Token came to life
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {storyPoints.map((point, index) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <point.icon className="h-8 w-8 text-primary mr-3" aria-hidden="true" />
                    <h3 className="text-2xl font-bold text-gray-900">{point.title}</h3>
                  </div>
                  <p className="text-gray-600">{point.content}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Today, Milton Token stands as a testament to the power of community, creativity, and cutting-edge technology. 
            Our journey is just beginning, and we invite you to be part of this exciting adventure in the world of meme finance.
          </p>
        </motion.div>
      </div>
    </section>
  )
}