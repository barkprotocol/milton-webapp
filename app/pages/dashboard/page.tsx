import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Wallet, ArrowUpRight, ArrowDownRight, Coins, Activity, Gift, Image, Zap, TrendingUp, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard | Milton',
  description: 'Your Milton ecosystem dashboard - Track your MILTON tokens, NFTs, and more!',
}

const activityData = [
  { name: 'Jan', Transactions: 50, Rewards: 25 },
  { name: 'Feb', Transactions: 75, Rewards: 35 },
  { name: 'Mar', Transactions: 100, Rewards: 50 },
  { name: 'Apr', Transactions: 85, Rewards: 40 },
  { name: 'May', Transactions: 120, Rewards: 60 },
  { name: 'Jun', Transactions: 90, Rewards: 45 },
]

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-primary">Milton Dashboard</h1>
        <Button variant="outline">
          <Sparkles className="mr-2 h-4 w-4" /> Claim Daily Reward
        </Button>
      </header>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,231.89 MILTON</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="text-green-500 mr-1 h-4 w-4" />
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rewards Earned</CardTitle>
            <Coins className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,324.62 MILTON</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="text-green-500 mr-1 h-4 w-4" />
              +10.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-accent/10 to-accent/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">NFTs Owned</CardTitle>
            <Image className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">3 new this month</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-muted/10 to-muted/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Governance Power</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24,531 vMILTON</div>
            <p className="text-xs text-muted-foreground">Represents 0.13% of total votes</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Activity Overview</CardTitle>
          <CardDescription>Your transaction and reward history</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="Transactions" fill="hsl(var(--primary))" />
                <Bar dataKey="Rewards" fill="hsl(var(--secondary))" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Tabs defaultValue="wallet" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="nft">NFT</TabsTrigger>
          <TabsTrigger value="governance">Governance</TabsTrigger>
          <TabsTrigger value="blinks">Solana Blinks</TabsTrigger>
        </TabsList>
        <TabsContent value="wallet">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest MILTON token movements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { type: 'received', source: 'Staking', amount: 50, date: '2024-10-5 14:30' },
                  { type: 'sent', source: 'Exchange', amount: 100, date: '2024-09-14 09:15' },
                  { type: 'received', source: 'Airdrop', amount: 25, date: '2024-11-05 18:45' },
                ].map((transaction, index) => (
                  <div key={index} className="flex items-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    {transaction.type === 'received' ? (
                      <ArrowUpRight className="h-4 w-4 mr-2 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 mr-2 text-red-500" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {transaction.type === 'received' ? 'Received from' : 'Sent to'} {transaction.source}
                      </p>
                      <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {transaction.type === 'received' ? '+' : '-'}{transaction.amount.toFixed(2)} MILTON
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="rewards">
          <Card>
            <CardHeader>
              <CardTitle>Rewards</CardTitle>
              <CardDescription>Your earned rewards and staking details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm font-medium mb-1">Total Staked</p>
                    <p className="text-2xl font-bold">10,000 MILTON</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm font-medium mb-1">Current APY</p>
                    <p className="text-2xl font-bold text-green-500">12.5%</p>
                  </div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-1">Rewards Earned (This Month)</p>
                  <p className="text-2xl font-bold">125.00 MILTON</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-1">Next Reward Distribution</p>
                  <p className="text-2xl font-bold">In 3 days</p>
                </div>
                <Button className="w-full">Claim Rewards</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="gallery">
          <Card>
            <CardHeader>
              <CardTitle>Your NFT Gallery</CardTitle>
              <CardDescription>MILTON ecosystem NFTs you own</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7].map((nft) => (
                  <div key={nft} className="flex flex-col items-center bg-muted/50 p-4 rounded-lg hover:bg-muted transition-colors">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-lg mb-2"></div>
                    <p className="text-sm font-medium">MILTON NFT #{nft}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="nft">
          <Card>
            <CardHeader>
              <CardTitle>NFT Minting</CardTitle>
              <CardDescription>Generate and mint your own MILTON NFTs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nft-name">NFT Name</Label>
                    <Input id="nft-name" placeholder="Enter NFT name" />
                  </div>
                  <div>
                    <Label htmlFor="nft-description">Description</Label>
                    <Input id="nft-description" placeholder="Enter NFT description" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="nft-attributes">Attributes (comma-separated)</Label>
                  <Input id="nft-attributes" placeholder="e.g., Rare, Animated, Limited Edition" />
                </div>
                <div className="flex justify-between items-center bg-muted/50 p-4 rounded-lg">
                  <span className="font-medium">Minting Cost:</span>
                  <span className="text-xl font-bold">100 MILTON</span>
                </div>
                <Button className="w-full">Generate & Mint NFT</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="governance">
          <Card>
            <CardHeader>
              <CardTitle>Active Proposals</CardTitle>
              <CardDescription>Current governance proposals you can vote on</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: 'MIP-23', title: 'Increase Staking Rewards', endsIn: '3 days' },
                  { id: 'MIP-24', title: 'New NFT Collection Launch', endsIn: '5 days' },
                  { id: 'MIP-25', title: 'Treasury Fund Allocation', endsIn: '7 days' },
                ].map((proposal, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                    <div>
                      <p className="text-sm font-medium">Proposal {proposal.id}: {proposal.title}</p>
                      <p className="text-xs text-muted-foreground">Ends in {proposal.endsIn}</p>
                    </div>
                    <Button variant="outline">Vote</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="blinks">
          <Card>
            <CardHeader>
              <CardTitle>Solana Blinks</CardTitle>
              <CardDescription>Your active Solana Blinks and details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: 1, type: 'Token Swap', description: 'MILTON to SOL' },
                  { id: 2, type: 'NFT Sale', description: 'MILTON NFT  #42' },
                  { id: 3, type: 'Crowdfunding', description: 'Community Project  Funding' },
                ].map((blink, index) => (
                  <div key={index} className="flex items-center justify-between p-4  bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                    <div>
                      <p className="text-sm font-medium">Blink #{blink.id}: {blink.type}</p>
                      <p className="text-xs text-muted-foreground">{blink.description}</p>
                    </div>
                    <Button variant="outline">View Details</Button>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button className="w-full">Create New Blink</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}