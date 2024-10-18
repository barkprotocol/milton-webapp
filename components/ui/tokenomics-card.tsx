import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TokenomicsCardProps {
  title: string
  value: string
}

export function TokenomicsCard({ title, value }: TokenomicsCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105">
      <CardHeader className="bg-gradient-to-r from-sand-200 to-sand-300 pb-2">
        <CardTitle className="text-lg font-semibold text-gray-800">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-3xl font-bold text-sand-800">{value}</p>
      </CardContent>
    </Card>
  )
}