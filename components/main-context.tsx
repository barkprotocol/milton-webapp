import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function MainContent() {
  return (
    <main className="flex-grow">
      <section className="bg-gradient-to-b from-background to-secondary/10 py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-primary mb-6">
              Welcome to Milton
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Revolutionizing social finance with the power of Solana blockchain
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/pages/get-started">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pages/learn-more">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}