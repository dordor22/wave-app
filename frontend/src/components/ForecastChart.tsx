import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

interface ForecastData {
  time: string
  waveHeight: number
  windSpeed: number
  period: number
  direction: string
}

interface ForecastChartProps {
  title: string
  data: ForecastData[]
}

export function ForecastChart({ title, data }: ForecastChartProps) {
  const maxWave = Math.max(...data.map(d => d.waveHeight))
  
  return (
    <Card className="shadow-wave bg-gradient-depth border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary-deep">
          <TrendingUp className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((forecast, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-card border border-primary/10 hover:bg-primary/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-sm font-medium text-primary-deep">{forecast.time}</div>
                  <div className="text-xs text-muted-foreground">{forecast.direction}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">{forecast.waveHeight}ft</div>
                  <div className="text-xs text-muted-foreground">Waves</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-bold text-secondary">{forecast.windSpeed}</div>
                  <div className="text-xs text-muted-foreground">mph</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-bold text-accent-foreground">{forecast.period}s</div>
                  <div className="text-xs text-muted-foreground">Period</div>
                </div>
              </div>
              
              <div className="flex items-center">
                {forecast.waveHeight > maxWave * 0.7 ? (
                  <Badge className="bg-primary text-primary-foreground">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Good
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    Fair
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}