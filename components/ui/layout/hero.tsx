'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Zap, Users, Heart, Globe, Rocket, Flame, FileText, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export function Hero() {
  const router = useRouter()
  const [isHovering, setIsHovering] = useState(false)
  const [badgeText, setBadgeText] = useState('')
  const [badgeIcon, setBadgeIcon] = useState<React.ReactNode>(null)

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const cards = useMemo(() => [
    { icon: Zap, title: "Fast Transactions", description: "Experience lightning-fast transactions on the Solana blockchain." },
    { icon: Users, title: "Community Driven", description: "Join a vibrant community of meme enthusiasts and Solana lovers." },
    { icon: Heart, title: "Disaster Relief", description: "Support global disaster relief efforts through MILTON transactions." },
    { icon: Globe, title: "Real-World Impact", description: "Use MILTON for charitable donations and social good initiatives." }
  ], [])

  const updateBadge = useCallback(() => {
    const launchDate = new Date('2024-10-15')
    const currentDate = new Date()
    const daysSinceLaunch = Math.floor((currentDate.getTime() - launchDate.getTime()) / (1000 * 3600 * 24))

    if (daysSinceLaunch < 0) {
      setBadgeText(`Launching in ${Math.abs(daysSinceLaunch)} days`)
      setBadgeIcon(<Rocket className="w-4 h-4 mr-1 text-[#FFECB1]" aria-hidden="true" />)
    } else if (daysSinceLaunch === 0) {
      setBadgeText('Launching Today!')
      setBadgeIcon(<Rocket className="w-4 h-4 mr-1 text-[#FFECB1]" aria-hidden="true" />)
    } else if (daysSinceLaunch <= 30) {
      setBadgeText('New Launch')
      setBadgeIcon(<Flame className="w-4 h-4 mr-1 text-[#FFECB1]" aria-hidden="true" />)
    } else {
      setBadgeText('') // No badge after 30 days
      setBadgeIcon(null)
    }
  }, [])

  useEffect(() => {
    updateBadge()
    const timer = setInterval(updateBadge, 1000 * 60 * 60) // Update every hour

    return () => clearInterval(timer)
  }, [updateBadge])

  const handleWhitepaperClick = useCallback(() => {
    window.open('https://whitepaper.miltonprotocol.com', '_blank', 'noopener,noreferrer')
  }, [])

  const handleCardKeyPress = useCallback((event: React.KeyboardEvent, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      setIsHovering(true)
      // Focus on the card content for better accessibility
      const cardContent = event.currentTarget.querySelector('.card-content')
      if (cardContent instanceof HTMLElement) {
        cardContent.focus()
      }
    }
  }, [])

  return (
    <section className="relative py-20 text-white overflow-hidden">
      <Image
        src="https://ucarecdn.com/4de9a21e-eea8-4546-bab1-c241ebe242cc/hurricane.jpeg"
        alt="Background image of a tornado symbolizing the power of Milton"
        fill
        style={{ objectFit: 'cover' }}
        quality={100}
        priority
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-gray-800/80" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center"
        >
          <div className="max-w-3xl mb-12">
            <AnimatePresence>
              {badgeText && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Badge className="mb-4 text-sm font-semibold bg-gray-900 text-[#FFECB1] px-3 py-1 rounded-full inline-flex items-center">
                    {badgeIcon}
                    {badgeText}
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
            <h1 className="text-4xl font-bold text-[#ffe288] tracking-tight sm:text-5xl md:text-6xl mb-4 text-shadow-sm">
              Welcome to Milton
              <span className="block text-[#FFECB1] mt-2 text-shadow-sm">The Storm of Solana</span>
            </h1>
            <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl">
              Brace Yourself for the Most Impactful and Innovative meme coin and ecosystem on the Blockchain!
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/pages/dashboard" passHref>
                <Button className="w-full sm:w-48 bg-[#ffe288] hover:bg-[#FFE49D] text-gray-900 font-semibold py-3 px-6 rounded-md inline-flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl">
                  Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Button>
              </Link>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full sm:w-48 bg-transparent hover:bg-[#ffe288]/10 text-[#ffe288] font-semibold py-3 px-6 rounded-md inline-flex items-center justify-center border border-[#FFECB1] transition-all duration-300 shadow-lg hover:shadow-xl"
                      onClick={handleWhitepaperClick}
                    >
                      <FileText className="mr-2 h-5 w-5" aria-hidden="true" />
                      Whitepaper
                      <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Opens in a new tab</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {cards.map((card, index) => (
              <motion.div
                key={card.title}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5 }}
              >
                <Card 
                  className="bg-white/10 backdrop-blur-sm border-[#FFECB1]/20 hover:bg-[#FFECB1]/20 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  tabIndex={0}
                  onKeyPress={(e) => handleCardKeyPress(e, index)}
                >
                  <CardHeader className="pb-2 text-center">
                    <CardTitle className="text-xl font-semibold flex flex-col items-center">
                      <card.icon className="mb-2 h-8 w-8 text-[#ffe288]" aria-hidden="true" />
                      <span className="text-[#FFECB1]">{card.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center card-content" tabIndex={-1}>
                    <p className="text-[#FFF5D6] text-sm">{card.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}