'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Github, Send } from 'lucide-react'
import { Icon } from '@iconify/react'
import { useState } from 'react'

export function Footer() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const description = "Empowering charitable initiatives through blockchain innovation. Milton Protocol combines meme culture with Solana technology to create a fun and impactful giving experience."

  const socialLinks = [
    { name: 'Discord', href: 'https://www.discord.gg', icon: 'mdi:discord' },
    { name: 'X', href: 'https://www.x.com/bark.protocol', icon: 'ri:twitter-x-fill' },
    { name: 'Instagram', href: 'https://www.instagram.com/bark.protocol', icon: Instagram },
    { name: 'GitHub', href: 'https://www.github.com/bark-protocol/', icon: Github },
    { name: 'Telegram', href: 'https://www.t.me/milton.protocol', icon: Send },
    { name: 'Medium', href: 'https://medium.com/@bark.protocol', icon: 'mdi:medium' },
  ]

  const footerSections = [
    {
      title: 'Features',
      items: ['Blink Creation', 'Swap', 'Staking', 'NFT Marketplace', 'Governance'],
    },
    {
      title: 'Support',
      items: ['Documentation', 'Guides', 'API Status', 'Community'],
    },
    {
      title: 'Legal',
      items: [
        { name: 'Privacy Policy', href: '/pages/privacy' },
        { name: 'Terms of Service', href: '/pages/terms-of-use' },
        { name: 'Cookie Policy', href: '/pages/cookies' },
        { name: 'Brand Guide', href: '/brand-guide' },
      ],
    },
  ]

  const toggleSection = (title: string) => {
    setExpandedSection(expandedSection === title ? null : title)
  }

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="space-y-6 col-span-1 lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 group">
              <Image
                src="https://ucarecdn.com/fe802b60-cb87-4adc-8e1d-1b16a05f9420/miltonlogoicon.svg"
                alt="Milton Logo"
                width={48}
                height={48}
                className="h-10 w-10 sm:h-12 sm:w-12 group-hover:scale-105 transition-transform duration-200"
              />
              <span className="text-xl sm:text-2xl font-bold text-white group-hover:text-primary transition-colors duration-200">MILTON</span>
            </Link>
            <p className="text-gray-300 text-sm sm:text-base max-w-xs">
              {description}
            </p>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-primary transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit our ${link.name} page`}
                >
                  {typeof link.icon === 'string' ? (
                    <Icon icon={link.icon} className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <link.icon className="h-6 w-6" aria-hidden="true" />
                  )}
                </a>
              ))}
            </div>
          </div>
          {footerSections.map((section) => (
            <div key={section.title} className="col-span-1">
              <button
                className="flex items-center justify-between w-full text-left text-sm font-semibold text-secondary tracking-wider uppercase mb-4 lg:cursor-default"
                onClick={() => toggleSection(section.title)}
              >
                {section.title}
                <span className="lg:hidden">
                  {expandedSection === section.title ? '−' : '+'}
                </span>
              </button>
              <ul className={`space-y-3 ${expandedSection === section.title ? 'block' : 'hidden lg:block'}`}>
                {section.items.map((item) => (
                  <li key={typeof item === 'string' ? item : item.name}>
                    {typeof item === 'string' ? (
                      <span className="text-sm sm:text-base text-gray-300">{item}</span>
                    ) : (
                      <Link 
                        href={item.href}
                        className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors duration-200"
                      >
                        {item.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-sm sm:text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} BARK Protocol. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}