import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, Clock } from 'lucide-react'

export interface CrowdfundingProps {
  title: string
  description: string
  creatorName: string
  creatorAvatar: string
  goalAmount: number
  currentAmount: number
  currency: string
  backers: number
  daysLeft: number
  status: 'active' | 'funded' | 'expired'
}

export function Crowdfunding({
  title,
  description,
  creatorName,
  creatorAvatar,
  goalAmount,
  currentAmount,
  currency,
  backers,
  daysLeft,
  status
}: CrowdfundingProps) {
  const progress = (currentAmount / goalAmount) * 100

  const getStatusBadge = () => {
    switch (status) {
      case 'active':
        return <Badge variant="secondary">Active</Badge>
      case 'funded':
        return <Badge variant="success">Funded</Badge>
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          {getStatusBadge()}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-4">
          <Avatar>
            <AvatarImage src={creatorAvatar} alt={creatorName} />
            <AvatarFallback>{creatorName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">Created by</p>
            <p className="text-sm text-muted-foreground">{creatorName}</p>
          </div>
        </div>
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{currentAmount} {currency}</span>
            <span>{goalAmount} {currency}</span>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{backers} backers</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{daysLeft} days left</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled={status !== 'active'}>
          {status === 'active' ? 'Back this project' : 'Funding closed'}
        </Button>
      </CardFooter>
    </Card>
  )
}