import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react'

export interface TransactionProps {
  type: 'send' | 'receive' | 'swap'
  amount: number
  token: string
  tokenIcon: string
  otherParty: string
  timestamp: string
  status: 'completed' | 'pending' | 'failed'
}

export function Transaction({
  type,
  amount,
  token,
  tokenIcon,
  otherParty,
  timestamp,
  status
}: TransactionProps) {
  const getTypeIcon = () => {
    switch (type) {
      case 'send':
        return <ArrowUpRight className="h-4 w-4 text-red-500" />
      case 'receive':
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />
      case 'swap':
        return <RefreshCw className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusBadge = () => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>
      case 'pending':
        return <Badge variant="warning">Pending</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={tokenIcon} alt={token} />
            <AvatarFallback>{token.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              {type.charAt(0).toUpperCase() + type.slice(1)} {token}
            </p>
            <p className="text-sm text-muted-foreground">{otherParty}</p>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <div className="flex items-center">
              {getTypeIcon()}
              <span className="ml-1 text-sm font-medium">
                {type === 'receive' ? '+' : '-'}{amount} {token}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{timestamp}</p>
          </div>
        </div>
        <div className="mt-2 flex justify-between items-center">
          {getStatusBadge()}
          <button className="text-sm text-blue-500 hover:underline" onClick={() => alert('View details clicked')}>
            View details
          </button>
        </div>
      </CardContent>
    </Card>
  )
}