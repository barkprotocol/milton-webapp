'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu, X, Rocket } from 'lucide-react'
import { WalletButton } from '@/components/ui/wallet-button'
import { motion, AnimatePresence } from 'framer-motion'

type NavItem = {
  href: string
  label: string
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  const navItems: NavItem[] = useMemo(() => [
    { href: '#features', label: 'Features' },
    { href: '/pages/solutions', label: 'Solutions' },
    { href: '#tokenomics', label: 'Tokenomics' },
    { href: '#faq', label: 'FAQ' },
    { href: '/app/demo', label: 'API' },
  ], [])

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 10)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const toggleMenu = () => setMenuOpen(prev => !prev)

  const isActive = (href: string) => pathname === href || pathname.startsWith(href)

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.replace(/.*#/, '')
    const elem = document.getElementById(targetId)
    elem?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const renderNavItems = (isMobile = false) => (
    navItems.map(item => (
      <Link
        key={item.href}
        href={item.href}
        onClick={(e) => item.href.startsWith('#') ? handleSmoothScroll(e, item.href) : (isMobile ? toggleMenu() : null)}
        className={`text-gray-600 hover:text-primary transition-colors py-2 ${isActive(item.href) ? 'font-semibold' : ''}`}
        aria-current={isActive(item.href) ? 'page' : undefined}
      >
        {item.label}
      </Link>
    ))
  )

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="https://ucarecdn.com/fe802b60-cb87-4adc-8e1d-1b16a05f9420/miltonlogoicon.svg"
              alt="Milton Logo"
              width={54}
              height={54}
              className="w-12 h-12"
              priority
            />
            <span className={`text-2xl font-bold ${scrolled ? 'text-gray-900' : 'text-gray-900'}`}>MILTON</span>
          </Link>
          <nav className="hidden md:flex space-x-8">
            {renderNavItems()}
          </nav>
          <div className="hidden md:flex space-x-4 items-center">
            <WalletButton />
            <Link href="/pages/buy" passHref>
              <Button variant="outline" className="text-primary hover:bg-primary/10">
                <Rocket className="mr-2 h-4 w-4" aria-hidden="true" />
                $Buy Milton
              </Button>
            </Link>
          </div>
          <button
            className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={toggleMenu}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X className={`h-6 w-6 ${scrolled ? 'text-gray-600' : 'text-gray-900'}`} aria-hidden="true" />
            ) : (
              <Menu className={`h-6 w-6 ${scrolled ? 'text-gray-600' : 'text-gray-900'}`} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white py-2"
          >
            <nav className="flex flex-col space-y-2 px-2">
              {renderNavItems(true)}
              <WalletButton />
              <Link href="/pages/blinkboard" passHref>
                <Button variant="outline" className="text-primary hover:bg-primary/10 w-full">
                  <Rocket className="mr-2 h-4 w-4" aria-hidden="true" />
                  Launch App
                </Button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
