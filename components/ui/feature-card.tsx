import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  isHovered: boolean
  isSelected: boolean
}

export function FeatureCard({ icon, title, description, isHovered, isSelected }: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Card 
        className={`h-full transition-shadow duration-300 ${
          isHovered || isSelected ? 'shadow-lg' : 'shadow'
        }`}
      >
        <CardHeader>
          <div className="flex items-center space-x-2">
            {icon}
            <CardTitle>{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className={`text-muted-foreground transition-opacity duration-300 ${
            isSelected ? 'opacity-100' : 'opacity-80'
          }`}>
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}