import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { motion } from 'framer-motion'

const faqItems = [
  {
    question: 'What is Milton?',
    answer: 'Milton is a decentralized finance platform built on the Solana blockchain that combines DeFi services with charitable giving. It allows users to grow their wealth while supporting important causes.',
  },
  {
    question: 'How does Milton support charitable causes?',
    answer: 'Milton incorporates charitable giving into its tokenomics. A portion of transaction fees and other platform activities are automatically allocated to verified charitable organizations.',
  },
  {
    question: 'Is Milton safe to use?',
    answer: 'Yes, Milton prioritizes security. We use advanced cryptographic measures and smart contract audits to ensure the safety of user funds and data. However, as with all DeFi platforms, users should exercise caution and do their own research.',
  },
  {
    question: 'How can I get started with Milton?',
    answer: 'To get started, you\'ll need a Solana wallet. Once you have that set up, you can connect to our platform, acquire MILTON tokens, and start exploring our DeFi services and charitable giving options.',
  },
]

export function FAQ() {
  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          className="text-2xl sm:text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Frequently Asked Questions
        </motion.h2>
        <Accordion type="single" collapsible className="max-w-3xl mx-auto space-y-4">
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <AccordionItem value={`item-${index}`} className="border rounded-lg overflow-hidden">
                <AccordionTrigger className="text-left px-4 py-3 hover:bg-muted/50 transition-colors">
                  <span className="text-lg font-semibold">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-4 py-3 bg-muted/20">
                  <p className="text-muted-foreground">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  )
}