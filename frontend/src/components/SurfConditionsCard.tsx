import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Waves, Wind, Thermometer, Eye } from "lucide-react"

interface SurfCondition {
  title: string
  value: string
  unit: string
  status: "excellent" | "good" | "fair" | "poor"
  icon: React.ComponentType<{ className?: string }>
}

interface SurfConditionsCardProps {
  location: string
  conditions: SurfCondition[]
  lastUpdated: string
}

const statusColors = {
  excellent: "bg-primary text-primary-foreground",
  good: "bg-secondary text-secondary-foreground", 
  fair: "bg-accent text-accent-foreground",
  poor: "bg-destructive text-destructive-foreground"
}

export function SurfConditionsCard({ location, conditions, lastUpdated }: SurfConditionsCardProps) {
  return (
    <Card className="shadow-wave hover:shadow-float transition-all duration-300 hover:scale-[1.02] bg-gradient-depth border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-primary-deep">{location}</CardTitle>
          <Badge variant="secondary" className="text-xs">Live</Badge>
        </div>
        <p className="text-sm text-muted-foreground">Updated {lastUpdated}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {conditions.map((condition, index) => {
          const IconComponent = condition.icon
          return (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-primary/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <IconComponent className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium text-card-foreground">{condition.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-primary-deep">
                  {condition.value}
                </span>
                <span className="text-sm text-muted-foreground">{condition.unit}</span>
                <Badge className={`text-xs ${statusColors[condition.status]}`}>
                  {condition.status}
                </Badge>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}