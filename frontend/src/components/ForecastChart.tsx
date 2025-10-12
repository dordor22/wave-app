import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceDot, Legend } from "recharts"

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
  const bestIdx = (() => {
    let idx = -1
    let best = -1
    for (let i = 0; i < data.length; i++) {
      const d = data[i]
      const score = d.waveHeight * 0.6 + d.period * 0.4
      if (score > best) { best = score; idx = i }
    }
    return idx
  })()

  const best = bestIdx >= 0 ? data[bestIdx] : undefined

  return (
    <Card className="shadow-wave bg-gradient-depth border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary-deep">
          <TrendingUp className="h-5 w-5" />
          {title}
          {best && (
            <Badge className="ml-3">Best at {best.time}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <XAxis dataKey="time" tick={{ fontSize: 12 }} interval={2} />
              <YAxis tick={{ fontSize: 12 }} unit="ft" allowDecimals={false} />
              <Tooltip formatter={(v: any, n: any) => n === 'waveHeight' ? [`${v} ft`, 'Wave'] : n === 'windSpeed' ? [`${v} km/h`, 'Wind'] : [`${v}s`, 'Period']} />
              <Legend />
              <Line name="Wave (ft)" type="monotone" dataKey="waveHeight" stroke="#0ea5e9" strokeWidth={2} dot={false} />
              <Line name="Period (s)" type="monotone" dataKey="period" stroke="#22c55e" strokeWidth={2} dot={false} yAxisId={0} />
              <Line name="Wind (km/h)" type="monotone" dataKey="windSpeed" stroke="#f43f5e" strokeWidth={1.5} dot={false} yAxisId={0} />
              {best && (
                <ReferenceDot x={best.time} y={best.waveHeight} r={5} fill="#f59e0b" stroke="none" />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}