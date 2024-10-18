import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Coins, Network, Hash, Calculator, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'

interface TokenDetail {
  name: string
  symbol: string
  network: string
  type: string
  totalSupply: string
  decimals: number
  contractAddress: string
}

interface TokenDetailsCardProps {
  tokenDetails: TokenDetail
}

export function TokenDetailsCard({ tokenDetails }: TokenDetailsCardProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "The contract address has been copied to your clipboard.",
      })
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Token Details</CardTitle>
        <CardDescription>Key information about the MILTON token</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center space-x-4">
          <Coins className="h-6 w-6 text-primary" />
          <div>
            <p className="text-sm font-medium">Name</p>
            <p className="text-xl font-bold">{tokenDetails.name}</p>
          </div>
          <Badge variant="secondary">{tokenDetails.symbol}</Badge>
        </div>
        <div className="flex items-center space-x-4">
          <Network className="h-6 w-6 text-primary" />
          <div>
            <p className="text-sm font-medium">Network</p>
            <p className="text-xl font-bold">{tokenDetails.network}</p>
          </div>
          <Badge variant="outline">{tokenDetails.type}</Badge>
        </div>
        <div className="flex items-center space-x-4">
          <Calculator className="h-6 w-6 text-primary" />
          <div>
            <p className="text-sm font-medium">Total Supply</p>
            <p className="text-xl font-bold">{tokenDetails.totalSupply}</p>
          </div>
          <Badge variant="outline">Decimals: {tokenDetails.decimals}</Badge>
        </div>
        <div className="flex items-center space-x-4">
          <Hash className="h-6 w-6 text-primary" />
          <div className="flex-grow">
            <p className="text-sm font-medium">Contract Address</p>
            <p className="text-xl font-bold truncate">{tokenDetails.contractAddress}</p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => copyToClipboard(tokenDetails.contractAddress)}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}