'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu, X, ChevronDown, Home, DollarSign } from 'lucide-react'
import { WalletButton } from '@/components/ui/wallet-button'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type NavItem = {
  href: string
  label: string
  icon?: React.ReactNode
  children?: NavItem[]
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  const navItems: NavItem[] = useMemo(() => [
    { href: '/', label: 'Home', icon: <Home className="w-4 h-4 mr-2" /> },
    { href: '/pages/learn-more', label: 'About' },
    {
      href: '#', label: 'Products', children: [
        { href: '#features', label: 'Features' },
        { href: '/pages/solutions', label: 'Solutions' },
        { href: '/pages/swap', label: 'Swap' },
        { href: '/pages/api/demo', label: 'API' },
      ]
    },
    { href: '#tokenomics', label: 'Tokenomics' },
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

  const isActive = useCallback((href: string) => pathname === href || pathname.startsWith(href), [pathname])

  const handleSmoothScroll = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.replace(/.*#/, '')
    const elem = document.getElementById(targetId)
    elem?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }, [])

  const renderNavItems = useMemo(() => (isMobile = false) => (
    navItems.map(item => (
      item.children ? (
        <DropdownMenu key={item.label}>
          <DropdownMenuTrigger className="flex items-center text-gray-600 hover:text-primary transition-colors py-2" aria-label={`${item.label} menu`}>
            {item.icon}
            {item.label}
            <ChevronDown className="ml-1 h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {item.children.map(child => (
              <DropdownMenuItem key={child.href}>
                <Link
                  href={child.href}
                  onClick={(e) => child.href.startsWith('#') ? handleSmoothScroll(e, child.href) : null}
                  className="w-full text-gray-600 hover:text-primary transition-colors"
                >
                  {child.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link
          key={item.href}
          href={item.href}
          onClick={(e) => item.href.startsWith('#') ? handleSmoothScroll(e, item.href) : (isMobile ? toggleMenu() : null)}
          className={`flex items-center text-gray-600 hover:text-primary transition-colors py-2 ${isActive(item.href) ? 'font-semibold' : ''}`}
          aria-current={isActive(item.href) ? 'page' : undefined}
        >
          {item.icon}
          {item.label}
        </Link>
      )
    ))
  ), [navItems, isActive, handleSmoothScroll])

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2 group">
            <Image
              src="https://ucarecdn.com/fe802b60-cb87-4adc-8e1d-1b16a05f9420/miltonlogoicon.svg"
              alt="Milton Logo"
              width={54}
              height={54}
              className="w-12 h-12 transition-transform group-hover:scale-110"
              priority
            />
            <span className={`text-2xl font-bold transition-colors ${scrolled ? 'text-gray-900' : 'text-gray-900'} group-hover:text-primary`}>MILTON</span>
          </Link>
          <nav className="hidden md:flex space-x-8">
            {renderNavItems()}
          </nav>
          <div className="hidden md:flex space-x-4 items-center">
            <WalletButton />
            <Link href="/pages/buy" passHref>
              <Button variant="outline" className="text-primary hover:bg-primary/10 transition-all duration-300 hover:scale-105">
                <DollarSign className="mr-0 h-4 w-4" aria-hidden="true" />
                Buy Milton
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
            className="md:hidden bg-white/90 backdrop-blur-md py-2"
          >
            <nav className="flex flex-col space-y-2 px-4">
              {renderNavItems(true)}
              <div className="w-full">
                <WalletButton />
              </div>
              <Link href="/pages/buy" passHref>
                <Button variant="outline" className="text-primary hover:bg-primary/10 w-full transition-all duration-300 hover:scale-105">
                  <DollarSign className="mr-1 h-4 w-4" aria-hidden="true" />
                  Buy Milton
                </Button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
