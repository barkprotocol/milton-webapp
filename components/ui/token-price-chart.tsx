'use client'

import React from 'react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { date: '2024-06-01', price: 4.50 },
  { date: '2024-06-02', price: 4.62 },
  { date: '2024-06-03', price: 4.78 },
  { date: '2024-06-04', price: 4.85 },
  { date: '2024-06-05', price: 4.90 },
  { date: '2024-06-06', price: 4.95 },
  { date: '2024-06-07', price: 4.99 },
]

export function TokenPriceChart() {
  return (
    <ChartContainer
      config={{
        price: {
          label: "Price",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line type="monotone" dataKey="price" stroke="var(--color-price)" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}