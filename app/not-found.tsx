'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { CircleIcon, Frown, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex items-center justify-center min-h-[100dvh] bg-gradient-to-b from-gray-50 to-white">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md space-y-8 p-6 text-center"
      >
        <motion.div 
          className="flex justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Image
            src="https://ucarecdn.com/fe802b60-cb87-4adc-8e1d-1b16a05f9420/miltonlogoicon.svg"
            alt="Milton Logo"
            width={64}
            height={64}
            className="text-primary"
          />
        </motion.div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          Oops! Page Not Found
        </h1>
        <div className="flex justify-center">
          <Frown className="h-12 w-12 text-gray-400" />
        </div>
        <p className="text-lg text-gray-600">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <div className="pt-4">
          <Button asChild className="bg-primary hover:bg-primary/90 text-white">
            <Link href="/" className="inline-flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}