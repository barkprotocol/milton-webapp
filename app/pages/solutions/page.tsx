import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Coins, Zap, Users, Trophy, Rocket, Shield, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Milton Services | Meme-Powered DeFi Solutions',
  description: 'Explore Milton\'s range of meme-infused DeFi services, including staking, NFT marketplace, community governance, and more.',
}

const services = [
  {
    title: "Meme Staking",
    description: "Stake your MILTON tokens and earn rewards while enjoying hilarious memes. Our staking platform combines DeFi yields with daily meme content.",
    icon: Coins,
    badge: "Popular",
    color: "text-yellow-500",
  },
  {
    title: "NFT Meme Marketplace",
    description: "Buy, sell, and trade exclusive meme NFTs using MILTON tokens. Our marketplace features unique, limited-edition meme collections.",
    icon: Zap,
    badge: "New",
    color: "text-yellow-500",
  },
  {
    title: "Community Governance",
    description: "Participate in decision-making and vote on meme proposals for the Milton ecosystem. Your voice matters in shaping our meme-driven future!",
    icon: Users,
    color: "text-yellow-500",
  },
  {
    title: "Meme Contests",
    description: "Enter meme creation contests and win MILTON token prizes. Showcase your creativity and humor to the entire Milton community.",
    icon: Trophy,
    color: "text-yellow-500",
  },
  {
    title: "Meme-Fi Yield Farming",
    description: "Provide liquidity and farm yields with a meme-tastic twist. Earn high APYs while enjoying themed farming pools based on popular memes.",
    icon: Rocket,
    color: "text-yellow-500",
  },
  {
    title: "Meme Vault",
    description: "Securely store your MILTON tokens and meme NFTs in our cutting-edge vault. Rest easy knowing your meme-based assets are protected.",
    icon: Shield,
    color: "text-yellow-500",
  },
]

export default function ServicesPage() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-foreground mb-4">Meme-Powered DeFi Services</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the hilarious and innovative DeFi solutions that Milton offers to revolutionize your crypto experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-full ${service.color} bg-opacity-10`}>
                    <service.icon className={`h-8 w-8 ${service.color}`} />
                  </div>
                  {service.badge && (
                    <Badge variant="secondary" className="text-xs font-semibold">
                      {service.badge}
                    </Badge>
                  )}
                </div>
                <CardTitle className="mt-4 text-2xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{service.description}</CardDescription>
                <Button variant="ghost" className="mt-4 text-primary hover:text-primary/80">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Join the Meme Revolution?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Dive into the world of meme-powered SocialFi and experience DeFi like never before. Start your journey with Milton today!
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button variant="secondary" size="lg" asChild>
              <a href="/">Back to Main</a>
            </Button>
            <Button variant="default" size="lg" asChild>
              <a href="/pages/dashboard">Get Started with Milton Dashboard</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}