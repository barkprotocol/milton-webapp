'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis } from 'recharts'
import { ChartPie, Coins, BarChart3, TrendingUp, Clock, DollarSign, Map, Image } from 'lucide-react'
import { ErrorBoundary } from '@/components/error-boundary'

const tokenDistribution = [
  { name: 'Community Rewards', value: 40, color: '#4a5568' },
  { name: 'Liquidity Pool', value: 25, color: '#2d3748' },
  { name: 'Team', value: 15, color: '#1a202c' },
  { name: 'Marketing & Ecosystem', value: 15, color: '#171923' },
  { name: 'Reserve', value: 5, color: '#0a0c0d' },
]

const emissionSchedule = [
  { year: 'Year 1', tokens: 3728000000 },
  { year: 'Year 2', tokens: 2982400000 },
  { year: 'Year 3', tokens: 2385920000 },
  { year: 'Year 4', tokens: 1908736000 },
  { year: 'Year 5', tokens: 1526988800 },
]

const vestingSchedule = [
  { month: 'Month 1-3', percentage: 0 },
  { month: 'Month 4-6', percentage: 10 },
  { month: 'Month 7-9', percentage: 20 },
  { month: 'Month 10-12', percentage: 30 },
  { month: 'Month 13-15', percentage: 40 },
  { month: 'Month 16-18', percentage: 60 },
  { month: 'Month 19-21', percentage: 80 },
  { month: 'Month 22-24', percentage: 100 },
]

const TokenomicsCard = ({ title, description, details }: { title: string; description: string; details: string[] }) => (
  <Card className="h-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
    <CardHeader>
      <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
      <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-200">
        {details.map((detail, index) => (
          <li key={index}>{detail}</li>
        ))}
      </ul>
    </CardContent>
  </Card>
)

const InfoCard = ({ title, description }: { title: string; description: string }) => (
  <Card className="bg-gray-50 dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
    <CardHeader>
      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription className="text-gray-600 dark:text-gray-300">{description}</CardDescription>
    </CardContent>
  </Card>
)

const ChartErrorFallback = ({ error }: { error: Error }) => (
  <div className="flex items-center justify-center h-full">
    <p className="text-red-500">Error loading chart: {error.message}</p>
  </div>
);


export function Tokenomics() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4 text-sm font-semibold px-3 py-1 bg-primary text-primary-foreground">
            Tokenomics
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            MILTON Token Economics
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Understand the economics and distribution of MILTON tokens within our ecosystem
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 mb-8 gap-2">
            <TabsTrigger value="overview" className="flex items-center justify-center">
              <ChartPie className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="token-details" className="flex items-center justify-center">
              <Coins className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Token Details</span>
            </TabsTrigger>
            <TabsTrigger value="distribution" className="flex items-center justify-center">
              <ChartPie className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Distribution</span>
            </TabsTrigger>
            <TabsTrigger value="emission-vesting" className="flex items-center justify-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Emission & Vesting</span>
            </TabsTrigger>
            <TabsTrigger value="token-sales" className="flex items-center justify-center">
              <DollarSign className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Token Sales</span>
            </TabsTrigger>
            <TabsTrigger value="nft" className="flex items-center justify-center">
              <Image className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">NFT</span>
            </TabsTrigger>
            <TabsTrigger value="roadmap" className="flex items-center justify-center">
              <Map className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Roadmap</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <TokenomicsCard
                title="Community-Driven Ecosystem"
                description="40% of tokens are allocated for community rewards, ensuring active participation and governance."
                details={[
                  "Staking rewards for long-term holders",
                  "Governance voting power",
                  "Participation incentives for ecosystem growth"
                ]}
              />
              <TokenomicsCard
                title="Liquidity and Stability"
                description="25% of tokens are dedicated to liquidity pools, ensuring stable trading and reduced slippage."
                details={[
                  "Deep liquidity across multiple DEXs",
                  "Reduced price impact for large trades",
                  "Improved trading experience for users"
                ]}
              />
              <TokenomicsCard
                title="Sustainable Growth Strategy"
                description="Balanced allocation for team, marketing, and reserve ensures long-term project sustainability."
                details={[
                  "15% allocated for team (vested)",
                  "15% for marketing and ecosystem development",
                  "5% strategic reserve for future developments"
                ]}
              />
              <TokenomicsCard
                title="Deflationary Mechanism"
                description="A quarterly token burn of 1.5% reduces supply and potentially increases value over time."
                details={[
                  "1.5% of circulating supply burned every quarter",
                  "Burn amount calculated based on current circulating supply",
                  "Increases scarcity and potential value of remaining tokens"
                ]}
              />
              <TokenomicsCard
                title="NFT Integration"
                description="NFTs play a crucial role in our ecosystem, providing unique benefits and opportunities."
                details={[
                  "Exclusive NFTs for governance participation",
                  "NFT staking for enhanced rewards",
                  "Limited edition NFTs for special events and milestones"
                ]}
              />
              <TokenomicsCard
                title="Fee Structure"
                description="Fees are strategically used to support the ecosystem's growth and sustainability."
                details={[
                  "Transaction fees contribute to the Treasury",
                  "A portion of fees used for token buyback and burn",
                  "Fee discounts for MILTON token holders and NFT owners"
                ]}
              />
            </div>
          </TabsContent>
          <TabsContent value="token-details">
            <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">MILTON Token Details</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-3 text-gray-700 dark:text-gray-200">
                  <li>Token Name: MILTON</li>
                  <li>Ticker: MILTON</li>
                  <li>Decimals: 9</li>
                  <li>Max Supply: 18.640 Billion MILTON</li>
                  <li>Token Standard: SPL and Token-2022 (Solana)</li>
                  <li>Blockchain: Solana</li>
                  <li>Use Cases: Governance, Staking, Platform Fees, Rewards, NFT Integration</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="distribution">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <ErrorBoundary fallback={<ChartErrorFallback error={new Error("Chart failed to load")} />}>
              <ChartContainer config={{}} className="h-[300px] sm:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tokenDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius="80%"
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {tokenDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              </ErrorBoundary>
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Token Allocation</h3>
                <ul className="space-y-4">
                  {tokenDistribution.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <span
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: item.color }}
                      ></span>
                      <span className="text-gray-700 dark:text-gray-300">{item.name}: {item.value}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="emission-vesting">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">Emission Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <ErrorBoundary fallback={<ChartErrorFallback error={new Error("Chart failed to load")} />}>
                  <ChartContainer config={{}} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={emissionSchedule}>
                        <XAxis dataKey="year" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="tokens" fill="#4a5568" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  </ErrorBoundary>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">Vesting Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <ErrorBoundary fallback={<ChartErrorFallback error={new Error("Chart failed to load")} />}>
                  <ChartContainer config={{}} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={vestingSchedule}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="percentage" fill="#4a5568" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  </ErrorBoundary>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
              <InfoCard
                title="Emission Strategy"
                description="Our deflationary model is designed to create scarcity over time, potentially increasing the value of MILTON tokens. The gradual reduction in emission rate helps maintain a balance between rewarding early adopters and ensuring long-term sustainability."
              />
              <InfoCard
                title="Vesting Importance"
                description="The vesting schedule for team tokens is crucial for maintaining trust and aligning long-term interests. It prevents large sell-offs and demonstrates our commitment to the  project's success over an extended period."
              />
              <InfoCard
                title="Quarterly Burn Mechanism"
                description="Every quarter, 1.5% of the circulating MILTON supply is burned. This deflationary mechanism is designed to reduce the overall supply over time, potentially increasing the value of remaining tokens. The burn amount is calculated based on the current circulating supply at the time of each quarterly burn event."
              />
              <InfoCard
                title="Ecosystem Growth"
                description="A portion of the tokens are allocated for ecosystem growth, including partnerships, grants, and community initiatives. This ensures continuous development and expansion of the MILTON ecosystem."
              />
            </div>
          </TabsContent>
          <TabsContent value="token-sales">
            <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">Token Sale Information</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-3 text-gray-700 dark:text-gray-200">
                  <li>Pre-Sale: 20% of total supply (3.728 Billion MILTON)</li>
                  <li>Public Sale: 20% of total supply (3.728 Billion MILTON)</li>
                  <li>Sale Price: To be announced</li>
                  <li>Minimum Purchase: 1,000 MILTON</li>
                  <li>Maximum Purchase: 1,000,000 MILTON</li>
                  <li>Accepted Currencies: SOL, USDC</li>
                  <li>KYC/AML: Required for participation</li>
                  <li>Vesting: 6-month linear vesting for pre-sale participants</li>
                  <li>Airdrop: To be announced</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="nft">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">NFT Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-200 mb-4">
                    MILTON NFTs play a crucial role in our ecosystem, providing unique benefits and opportunities for holders:
                  </p>
                  <ul className="list-disc pl-5 space-y-3 text-gray-700 dark:text-gray-200">
                    <li>Governance participation: Exclusive voting rights on key decisions</li>
                    <li>Staking rewards: Enhanced yields for NFT stakers</li>
                    <li>Access to premium features: Exclusive platform capabilities</li>
                    <li>Community events: Priority access to MILTON events and collaborations</li>
                    <li>Ecosystem growth: NFT sales contribute to liquidity and development funds</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">NFT Minting Process</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-200 mb-4">
                    The MILTON NFT minting process is designed to be fair and beneficial to the ecosystem:
                  </p>
                  <ul className="list-disc pl-5 space-y-3 text-gray-700 dark:text-gray-200">
                    <li>Limited supply: Only a fixed number of NFTs will be minted</li>
                    <li>Phased release: NFTs will be released in stages to ensure fair distribution</li>
                    <li>MILTON token utility: Minting requires MILTON tokens, increasing token demand</li>
                    <li>Burn mechanism: A portion of minting fees is used for token buyback and burn</li>
                    <li>Ecosystem allocation: Part of the minting proceeds goes to ecosystem development</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="roadmap">
            <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">Roadmap</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-3 text-gray-700 dark:text-gray-200">
                  <li>Ω3 2024: Website, dApp MVP and Documentation</li>
                  <li>Ω4 2024: Ecosystem, Token Creation, and Initial NFT Collection Launch</li>
                  <li>Q4 2024: Pre-Sale, Governance DAO, and NFT Staking</li>
                  <li>Q1 2025: Public Sale, Exchange Listings, and NFT Marketplace Integration</li>
                  <li>Q2 2025: Liquidity Provision, First Quarterly Burn, and NFT-based Governance Features</li>
                  <li>Q3 2025: Ecosystem Grants Program Initiation and NFT Collaborations</li>
                  <li>Q4 2025: Staking, Swap Launch, and Advanced NFT Utility Implementation</li>
                  <li>Q2 2026: Integration with Major DeFi Protocols and NFT-Fi Features</li>
                  <li>Q3 2026: Cross-Chain Expansion, Bridges, and Multi-Chain NFT Support</li>
                  <li>Q4 2026: Launch of AI MILTON-powered DApps and AI-generated NFT Collections</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}