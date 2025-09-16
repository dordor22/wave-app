import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Waves, Wind, Thermometer, Eye, X } from "lucide-react"

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
  score?: { value: number, level: keyof typeof statusColors }
  onRemove?: () => void
  onClick?: () => void
}

const statusColors = {
  excellent: "bg-primary text-primary-foreground",
  good: "bg-secondary text-secondary-foreground", 
  fair: "bg-accent text-accent-foreground",
  poor: "bg-destructive text-destructive-foreground"
}

const levelBorder: Record<keyof typeof statusColors, string> = {
  excellent: "border-green-400/50",
  good: "border-blue-400/50",
  fair: "border-yellow-400/50",
  poor: "border-red-400/50"
}

export function SurfConditionsCard({ location, conditions, lastUpdated, score, onRemove, onClick }: SurfConditionsCardProps) {
  return (
    <Card onClick={onClick} className={`cursor-pointer shadow-wave hover:shadow-float transition-all duration-300 hover:scale-[1.02] bg-gradient-depth border ${score ? levelBorder[score.level] : 'border-primary/20'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-primary-deep">{location}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">Live</Badge>
            {onRemove && (
              <button aria-label="Remove" onClick={onRemove} className="rounded-md p-1 hover:bg-primary/10">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Updated {lastUpdated}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {score && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-primary/10">
            <span className="font-medium text-card-foreground">Surf Score</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary-deep">{score.value}</span>
              <Badge className={`text-xs ${statusColors[score.level]}`}>{score.level}</Badge>
            </div>
          </div>
        )}
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