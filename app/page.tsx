'use client'

import { useState, useEffect } from 'react'
import { Hero } from "@/components/ui/layout/hero"
import { About } from "@/components/ui/layout/about"
import { Features } from "@/components/ui/layout/features"
import { Tokenomics } from "@/components/ui/layout/tokenomics"
import { CTA } from "@/components/ui/layout/cta"
import { Newsletter } from "@/components/ui/layout/newsletter"
import { FAQ } from "@/components/ui/layout/faq"
import { ExperienceBlinkboard } from "@/components/ui/blinkboard/experience-blinkboard"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export default function Page() {
  const [isLoading, setIsLoading] = useState(true)
  const [userWalletConnected, setUserWalletConnected] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleWalletConnection = () => {
    // Simulate wallet connection
    setUserWalletConnected(true)
    toast({
      title: "Wallet Connected",
      description: "Your wallet has been successfully connected to Milton.",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-primary"
        >
          <Loader2 className="w-12 h-12" />
        </motion.div>
      </div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Hero />
        <main className="flex-1 flex flex-col">
          <About />
          <ExperienceBlinkboard />
          <Features />
          <Tokenomics />
          <FAQ />
          <CTA />
          <Newsletter />
        </main>
        <AnimatePresence>
          {!userWalletConnected && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
              className="fixed bottom-4 right-4 z-50"
            >
              <Button 
                onClick={handleWalletConnection} 
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
              >
                Connect Wallet
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}