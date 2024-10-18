'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Wallet, Send, CheckCircle } from 'lucide-react'

export function Features() {
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  const steps = [
    {
      title: "Connect Your Wallet",
      description: "Link your Solana wallet to Blinkboard for seamless transactions.",
      icon: Wallet,
    },
    {
      title: "Create a Blink",
      description: "Set up your transaction with recipient, amount, and optional features.",
      icon: Zap,
    },
    {
      title: "Send Instantly",
      description: "Execute your transaction at lightning speed on the Solana network.",
      icon: Send,
    },
    {
      title: "Confirmation",
      description: "Receive instant confirmation of your completed transaction.",
      icon: CheckCircle,
    },
  ]

  const handleGetStarted = () => {
    setHasStarted(true)
    router.push('/pages/blinkboard/')
  }

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How Blinkboard Works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of fast, secure, and easy transactions on the Solana network.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <Card className="w-full shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-primary">Blinkboard Process</CardTitle>
              <CardDescription>Follow these simple steps to use Blinkboard</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {steps.map((step, index) => (
                  <motion.li
                    key={index}
                    className={`flex items-start space-x-4 p-4 rounded-lg transition-colors ${
                      activeStep === index ? 'bg-primary text-primary-foreground' : 'bg-gray-100'
                    }`}
                    onMouseEnter={() => setActiveStep(index)}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-white text-primary font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className={`font-semibold ${activeStep === index ? 'text-primary-foreground' : 'text-gray-900'}`}>
                        {step.title}
                      </h3>
                      <p className={activeStep === index ? 'text-primary-foreground' : 'text-gray-600'}>
                        {step.description}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <div className="relative h-[400px]">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="absolute inset-0 flex flex-col items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: activeStep === index ? 1 : 0,
                  scale: activeStep === index ? 1 : 0.8,
                }}
                transition={{ duration: 0.5 }}
              >
                <step.icon className="w-32 h-32 mb-6 text-primary" />
                <h3 className="text-2xl font-bold mb-2 text-gray-900">{step.title}</h3>
                <p className="text-center text-gray-600 max-w-md">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Button size="lg" className="group bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleGetStarted}>
            Try Blinkboard Now
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}