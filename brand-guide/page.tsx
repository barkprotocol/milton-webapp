'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from 'next/image'

const colorPalette = [
  { name: 'Primary Yellow', hex: '#FFE288', rgb: 'rgb(255, 226, 136)' },
  { name: 'Secondary Yellow', hex: '#FFECB1', rgb: 'rgb(255, 236, 177)' },
  { name: 'Dark Gray', hex: '#333333', rgb: 'rgb(51, 51, 51)' },
  { name: 'Light Gray', hex: '#F5F5F5', rgb: 'rgb(245, 245, 245)' },
  { name: 'White', hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)' },
]

const typography = [
  { name: 'Heading 1', className: 'text-4xl font-bold', example: 'Main Heading' },
  { name: 'Heading 2', className: 'text-3xl font-semibold', example: 'Section Heading' },
  { name: 'Heading 3', className: 'text-2xl font-medium', example: 'Subsection Heading' },
  { name: 'Body', className: 'text-base', example: 'Regular text for paragraphs and content.' },
  { name: 'Small', className: 'text-sm', example: 'Smaller text for captions or notes.' },
]

const logoUsage = [
  { name: 'Primary Logo', src: '/images/milton-logo-primary.svg', alt: 'Milton Primary Logo' },
  { name: 'Secondary Logo', src: '/images/milton-logo-secondary.svg', alt: 'Milton Secondary Logo' },
  { name: 'Icon', src: '/images/milton-icon.svg', alt: 'Milton Icon' },
]

export default function BrandGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1 
        className="text-4xl font-bold mb-8 text-center text-[#FFE288]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Milton Brand Guide
      </motion.h1>

      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="colors">Color Palette</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="logo">Logo Usage</TabsTrigger>
          <TabsTrigger value="guidelines">Brand Guidelines</TabsTrigger>
        </TabsList>

        <TabsContent value="colors">
          <Card>
            <CardHeader>
              <CardTitle>Color Palette</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {colorPalette.map((color) => (
                  <div key={color.name} className="flex flex-col items-center">
                    <div 
                      className="w-24 h-24 rounded-full mb-2" 
                      style={{ backgroundColor: color.hex }}
                    />
                    <h3 className="font-semibold">{color.name}</h3>
                    <p className="text-sm">{color.hex}</p>
                    <p className="text-sm">{color.rgb}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography">
          <Card>
            <CardHeader>
              <CardTitle>Typography</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {typography.map((type) => (
                  <div key={type.name} className="border-b pb-4">
                    <h3 className="font-semibold mb-2">{type.name}</h3>
                    <p className={type.className}>{type.example}</p>
                    <p className="text-sm mt-2">Class: {type.className}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logo">
          <Card>
            <CardHeader>
              <CardTitle>Logo Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {logoUsage.map((logo) => (
                  <div key={logo.name} className="flex flex-col items-center">
                    <Image 
                      src={logo.src} 
                      alt={logo.alt} 
                      width={200} 
                      height={200} 
                      className="mb-4"
                    />
                    <h3 className="font-semibold">{logo.name}</h3>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guidelines">
          <Card>
            <CardHeader>
              <CardTitle>Brand Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <section>
                  <h3 className="text-xl font-semibold mb-2">Voice and Tone</h3>
                  <p>Milton's voice is friendly, approachable, and knowledgeable. We aim to simplify complex blockchain concepts and make them accessible to all users.</p>
                </section>
                <section>
                  <h3 className="text-xl font-semibold mb-2">Imagery</h3>
                  <p>Use high-quality images that represent diversity, technology, and community. Avoid cliché blockchain imagery.</p>
                </section>
                <section>
                  <h3 className="text-xl font-semibold mb-2">Social Media</h3>
                  <p>Maintain a consistent presence across platforms. Use our brand colors and typography in all social media graphics.</p>
                </section>
                <section>
                  <h3 className="text-xl font-semibold mb-2">Partnerships</h3>
                  <p>When collaborating with partners, ensure that Milton's brand identity is respected and properly represented.</p>
                </section>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}