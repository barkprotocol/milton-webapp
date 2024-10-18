import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LucideIcon } from 'lucide-react'

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface BlinkboardCardProps {
  title: string;
  description: string;
  features: Feature[];
  buttonText?: string;
  onButtonClick?: () => void;
}

export const BlinkboardCard: React.FC<BlinkboardCardProps> = ({
  title,
  description,
  features,
  buttonText,
  onButtonClick,
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-4 bg-secondary/50 p-4 rounded-lg">
              <feature.icon className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold">{feature.title}</p>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
          {buttonText && (
            <Button 
              className="w-full" 
              variant="outline"
              onClick={onButtonClick}
            >
              {buttonText}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}