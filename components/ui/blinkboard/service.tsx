'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Rocket, Edit, Eye, Share2, Zap, Users, Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const steps = [
  {
    title: "Launch the App",
    description: "Begin by clicking the \"Launch App\" button. This will take you directly to the Blink Editor dashboard, where you can start creating your Blinks.",
    icon: Rocket,
    image: "/placeholder.svg?height=200&width=300"
  },
  {
    title: "Fill in Your Blink Details",
    description: "In the Blink Editor, input all the necessary information for your Blink card. Be sure to choose the correct category for your use case, whether it's crowdfunding, token swaps, donations, or NFT sales.",
    icon: Edit,
    image: "/placeholder.svg?height=200&width=300"
  },
  {
    title: "Preview Your Blink",
    description: "Before finalizing, review your Blink to make sure everything looks just right. Once you're satisfied with the details, click \"Create\" to publish your Blink.",
    icon: Eye,
    image: "/placeholder.svg?height=200&width=300"
  },
  {
    title: "Share Your Blink",
    description: "After creating your Blink, it's ready to be shared! Spread it across platforms, engage your audience, and make blockchain interactions seamless.",
    icon: Share2,
    image: "/placeholder.svg?height=200&width=300"
  }
]

const services = [
  {
    title: "Fast Transactions",
    description: "Experience lightning-fast blockchain interactions with Blinkboard's optimized transaction processing.",
    icon: Zap,
  },
  {
    title: "Community-Driven",
    description: "Join a vibrant community of creators and supporters, collaborating on various blockchain initiatives.",
    icon: Users,
  },
  {
    title: "Social Impact",
    description: "Use Blinkboard for charitable donations and social good projects, making a real-world difference.",
    icon: Heart,
  },
]

export function Service() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">Our Services</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Blinkboard offers a range of services to simplify your blockchain interactions and empower your projects.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <service.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">HOW TO USE BLINKBOARD</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your step-by-step guide to getting started
          </p>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4">
            Whether you're new or just need a refresher, this simple guide will help you get the most out of Blinkboard in no time.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={step.image}
                    alt={`Step ${index + 1}: ${step.title}`}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center mr-3">
                      {index + 1}
                    </div>
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{step.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center bg-card p-8 rounded-lg shadow-md"
        >
          <h3 className="text-2xl font-bold text-foreground mb-4">Ready to create your first Blink?</h3>
          <p className="text-muted-foreground mb-6">Join thousands of users who are already simplifying their blockchain interactions with Blinkboard.</p>
          <Link href="/app" passHref>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105">
              Launch App <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}