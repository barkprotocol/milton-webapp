import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface TokenMetric {
  label: string
  value: string
  description: string
}

interface TokenMetricProps {
  metrics: TokenMetric[]
}

export function TokenMetric({ metrics }: TokenMetricProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">Token Metrics</CardTitle>
        <CardDescription>Key figures about MILTON token</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-2 p-4 bg-secondary/50 rounded-lg">
              <h3 className="text-base sm:text-lg font-semibold">{metric.label}</h3>
              <p className="text-xl sm:text-2xl font-bold text-primary">{metric.value}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">{metric.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}