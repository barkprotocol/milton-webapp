import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Coins, Clock, Users, Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export interface TokenSaleProps {
  tokenName: string
  tokenSymbol: string
  tokenIcon: string
  description: string
  price: number
  currency: string
  totalSupply: number
  soldAmount: number
  startDate: string
  endDate: string
  minPurchase: number
  maxPurchase: number
  participants: number
  status: 'upcoming' | 'active' | 'ended'
}

export function TokenSale({
  tokenName,
  tokenSymbol,
  tokenIcon,
  description,
  price,
  currency,
  totalSupply,
  soldAmount,
  startDate,
  endDate,
  minPurchase,
  maxPurchase,
  participants,
  status
}: TokenSaleProps) {
  const progress = (soldAmount / totalSupply) * 100
  const [purchaseAmount, setPurchaseAmount] = React.useState('')

  const getStatusBadge = () => {
    switch (status) {
      case 'upcoming':
        return <Badge variant="secondary">Upcoming</Badge>
      case 'active':
        return <Badge variant="success">Active</Badge>
      case 'ended':
        return <Badge variant="destructive">Ended</Badge>
    }
  }

  const handlePurchase = () => {
    // Implement purchase logic here
    console.log(`Purchasing ${purchaseAmount} ${tokenSymbol}`)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={tokenIcon} alt={tokenName} />
              <AvatarFallback>{tokenSymbol}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl font-bold">{tokenName}</CardTitle>
              <CardDescription>{tokenSymbol}</CardDescription>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Price:</span>
            <span className="text-sm">{price} {currency}</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress:</span>
              <span>{soldAmount.toLocaleString()} / {totalSupply.toLocaleString()} {tokenSymbol}</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {status === 'upcoming' ? `Starts: ${startDate}` : `Ends: ${endDate}`}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{participants} participants</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="purchaseAmount">Amount to purchase</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="purchaseAmount"
                type="number"
                placeholder={`Min: ${minPurchase}, Max: ${maxPurchase}`}
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
                className="flex-1"
              />
              <span className="text-sm font-medium">{tokenSymbol}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button 
          className="w-full" 
          onClick={handlePurchase}
          disabled={status !== 'active' || !purchaseAmount || Number(purchaseAmount) < minPurchase || Number(purchaseAmount) > maxPurchase}
        >
          {status === 'active' ? 'Purchase Tokens' : 'Sale not active'}
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center text-sm text-muted-foreground">
                <Info className="h-4 w-4 mr-1" />
                <span>Purchase limits apply</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Minimum purchase: {minPurchase} {tokenSymbol}</p>
              <p>Maximum purchase: {maxPurchase} {tokenSymbol}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  )
}