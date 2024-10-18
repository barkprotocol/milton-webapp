import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export function CTA() {
  return (
    <section className="bg-primary text-primary-foreground py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl text-secondary sm:text-4xl font-bold mb-6">
            Ready to revolutionize your financial future?
          </h2>
          <p className="text-lg sm:text-xl mb-8">
            Join Milton today and experience the power of social finance combined with charitable giving.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              asChild 
              size="lg" 
              className="w-full sm:w-auto bg-white text-primary hover:bg-gray-100 transition-colors duration-200"
            >
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto border-2 border-white text-primary hover:bg-white hover:text-primary transition-colors duration-200"
            >
              <Link href="/learn-more">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}