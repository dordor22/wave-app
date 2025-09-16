import { Button } from "@/components/ui/button"
import { SurfConditionsCard } from "@/components/SurfConditionsCard"
import { ForecastChart } from "@/components/ForecastChart"
import { useQuery } from "@tanstack/react-query"
import { fetchMarine, searchMarine } from "@/lib/api"
import { Waves, Wind, Thermometer, Eye, MapPin, Clock, Activity } from "lucide-react"
import heroWave from "@/assets/hero-wave.jpg"
import React from "react"

const toFt = (meters: number | undefined) => meters == null ? undefined : Math.round(meters * 3.28084)

type ScoreLevel = "poor" | "fair" | "good" | "excellent"

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))

function scoreSurfQuality(params: { waveFt?: number, periodSec?: number, windChopM?: number }) {
  const { waveFt, periodSec, windChopM } = params
  // Subscores 0-100
  // Wave height target ~ 3-6 ft (best), taper outside
  const waveScore = (() => {
    if (waveFt == null) return 0
    if (waveFt <= 1) return 10
    if (waveFt >= 12) return 30
    // piecewise favor 3-6 the most
    if (waveFt < 3) return 40 + (waveFt - 1) * 20 // 1->10, 2->30, 3->50 approx
    if (waveFt <= 6) return 70 + (waveFt - 3) * 10 // 3->70, 6->100
    return 70 - (waveFt - 6) * 8 // 7->62, 10->38
  })()

  // Period: higher is better up to ~16s
  const periodScore = (() => {
    if (periodSec == null) return 0
    const capped = clamp(periodSec, 5, 16)
    return Math.round(((capped - 5) / (16 - 5)) * 100) // 5s->0, 16s->100
  })()

  // Wind chop (wind_wave_height): less is better; 0m->100, 1.5m->0
  const chopScore = (() => {
    if (windChopM == null) return 0
    const capped = clamp(windChopM, 0, 1.5)
    return Math.round((1 - capped / 1.5) * 100)
  })()

  // Weighted overall score
  const overall = Math.round(waveScore * 0.45 + periodScore * 0.35 + chopScore * 0.20)
  const level: ScoreLevel = overall >= 80 ? "excellent" : overall >= 60 ? "good" : overall >= 40 ? "fair" : "poor"
  return { overall, level, parts: { waveScore, periodScore, chopScore } }
}

const useMarine = () => useQuery({
  queryKey: ["marine"],
  queryFn: fetchMarine,
  staleTime: 1000 * 60 * 5
})

const Index = () => {
  const { data, isLoading, isError } = useMarine()
  const spots = data?.spots ?? []
  const [query, setQuery] = React.useState("")
  const [selected, setSelected] = React.useState<{ name: string, hourly?: any } | null>(null)
  const [added, setAdded] = React.useState<Array<{ id: string, name: string, hourly: any }>>([])
  const [suggestions, setSuggestions] = React.useState<Array<{ name: string }>>([])
  const [hiddenBuiltIns, setHiddenBuiltIns] = React.useState<Set<string>>(new Set())

  async function onSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    try {
      const res = await searchMarine(q)
      const name = res.spot.city
      setAdded(prev => {
        const exists = prev.some(x => x.name.toLowerCase() === name.toLowerCase())
        const builtInExists = spots.some(s => s.city.toLowerCase() === name.toLowerCase()) && !hiddenBuiltIns.has(name)
        if (exists || builtInExists) return prev
        const next = [{ id: `${name}-${Date.now()}`, name, hourly: res.data?.hourly }, ...prev]
        return next.slice(0, Math.max(0, 6 - (spots.filter(s => !hiddenBuiltIns.has(s.city)).length)))
      })
      setSelected({ name, hourly: res.data?.hourly })
      setSuggestions([])
    } catch (_e) {
      setSelected(null)
    }
  }

  async function onSuggest(val: string) {
    const q = val.trim()
    setQuery(val)
    if (!q) { setSuggestions([]); return }
    try {
      const { suggestPlaces } = await import("@/lib/api")
      const r = await suggestPlaces(q)
      setSuggestions(r.results.map(x => ({ name: x.name })))
    } catch {
      setSuggestions([])
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient-depth">
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <img 
          src={heroWave} 
          alt="Ocean waves breaking on the shore" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-deep/60 via-primary/30 to-transparent" />
        <div className="relative z-10 flex items-center justify-center h-full text-center px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Surf Conditions Platform
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              Real-time wave forecasting with AI-powered predictions for optimal surf sessions
            </p>
            <form onSubmit={onSearch} className="flex flex-col sm:flex-row gap-3 justify-center">
              <input
                value={query}
                onChange={e => onSuggest(e.target.value)}
                placeholder="Find surf spot (city or beach)"
                className="w-full sm:w-96 px-4 py-3 rounded-lg border border-white/40 bg-white/90 focus:outline-none"
              />
              <Button variant="wave" size="lg" className="text-lg px-8 py-4" type="submit">
                <MapPin className="mr-2 h-5 w-5" />
                Find Surf Spots
              </Button>
              {suggestions.length > 0 && (
                <div className="absolute mt-2 w-full sm:w-96 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow border">
                  {suggestions.map((s, i) => (
                    <button key={i} type="button" className="block w-full text-left px-3 py-2 hover:bg-gray-100" onClick={() => { setQuery(s.name); setSuggestions([]) }}>
                      {s.name}
                    </button>
                  ))}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Current Conditions */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-deep mb-4">
              Live Surf Conditions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real-time data from our network of buoys and weather stations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              {isLoading && <div className="text-center">Loading live conditions…</div>}
              {isError && <div className="text-center text-red-600">Failed to load conditions</div>}
              {!isLoading && !isError && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {spots.filter(s => !hiddenBuiltIns.has(s.city)).map((spot, index) => {
                      const hourly = spot.data?.hourly
                      const waveHeights: number[] | undefined = hourly?.wave_height
                      const periods: number[] | undefined = hourly?.wave_period
                      const windChop: number[] | undefined = hourly?.wind_wave_height
                      const windSpeed: number[] | undefined = hourly?.wind_speed_10m
                      const latestIdx = waveHeights && waveHeights.length > 0 ? waveHeights.length - 1 : undefined
                      const latestWaveFt = latestIdx != null ? toFt(waveHeights[latestIdx]) : undefined
                      const latestPeriod = latestIdx != null && periods ? periods[latestIdx] : undefined
                      const latestChop = latestIdx != null && windChop ? windChop[latestIdx] : undefined
                      const latestWind = latestIdx != null && windSpeed ? windSpeed[latestIdx] : undefined

                      const { overall, level } = scoreSurfQuality({ waveFt: latestWaveFt, periodSec: latestPeriod, windChopM: latestChop })

                      const conditions = [
                        { title: "Wave Height", value: latestWaveFt ?? "-", unit: typeof latestWaveFt === 'number' ? "ft" : "", status: "good" as const, icon: Waves },
                        { title: "Period", value: latestPeriod ?? "-", unit: typeof latestPeriod === 'number' ? "s" : "", status: "good" as const, icon: Activity },
                        { title: "Wind Chop", value: latestChop ?? "-", unit: typeof latestChop === 'number' ? "m" : "", status: "fair" as const, icon: Wind },
                        { title: "Wind", value: latestWind ?? "-", unit: typeof latestWind === 'number' ? "km/h" : "", status: "fair" as const, icon: Wind },
                      ]

                      return (
                        <SurfConditionsCard
                          key={index}
                          location={spot.city}
                          conditions={conditions}
                          lastUpdated={"now"}
                          score={{ value: overall, level }}
                          onRemove={() => setHiddenBuiltIns(prev => new Set([...prev, spot.city]))}
                          onClick={() => setSelected({ name: spot.city, hourly: spot.data?.hourly })}
                        />
                      )
                    })}
                  {(() => {
                    const builtInsShown = spots.filter(s => !hiddenBuiltIns.has(s.city)).length
                    const allowed = Math.max(0, 6 - builtInsShown)
                    return added.slice(0, allowed).map((s) => {
                      const hourly = s.hourly
                      const waveHeights: number[] | undefined = hourly?.wave_height
                      const periods: number[] | undefined = hourly?.wave_period
                      const windChop: number[] | undefined = hourly?.wind_wave_height
                      const windSpeed: number[] | undefined = hourly?.wind_speed_10m
                      const latestIdx = waveHeights && waveHeights.length > 0 ? waveHeights.length - 1 : undefined
                      const latestWaveFt = latestIdx != null ? toFt(waveHeights[latestIdx]) : undefined
                      const latestPeriod = latestIdx != null && periods ? periods[latestIdx] : undefined
                      const latestChop = latestIdx != null && windChop ? windChop[latestIdx] : undefined
                      const latestWind = latestIdx != null && windSpeed ? windSpeed[latestIdx] : undefined
                      const { overall, level } = scoreSurfQuality({ waveFt: latestWaveFt, periodSec: latestPeriod, windChopM: latestChop })
                      const conditions = [
                        { title: "Wave Height", value: latestWaveFt ?? "-", unit: typeof latestWaveFt === 'number' ? "ft" : "", status: "good" as const, icon: Waves },
                        { title: "Period", value: latestPeriod ?? "-", unit: typeof latestPeriod === 'number' ? "s" : "", status: "good" as const, icon: Activity },
                        { title: "Wind Chop", value: latestChop ?? "-", unit: typeof latestChop === 'number' ? "m" : "", status: "fair" as const, icon: Wind },
                        { title: "Wind", value: latestWind ?? "-", unit: typeof latestWind === 'number' ? "km/h" : "", status: "fair" as const, icon: Wind },
                      ]
                      return (
                        <SurfConditionsCard
                          key={s.id}
                          location={s.name}
                          conditions={conditions}
                          lastUpdated={"now"}
                          score={{ value: overall, level }}
                          onRemove={() => setAdded(prev => prev.filter(x => x.id !== s.id))}
                          onClick={() => setSelected({ name: s.name, hourly: s.hourly })}
                        />
                      )
                    })
                  })()}
                </div>
              )}
            </div>
            <aside className="lg:col-span-1">
              <div className="sticky top-6 space-y-4">
                <div className="p-4 rounded-lg bg-card/50 border border-primary/10">
                  <h3 className="font-semibold text-primary-deep mb-2">Surf Score Levels</h3>
                  <ul className="space-y-2 text-sm">
                    <li><span className="font-medium">80-100</span> – Excellent</li>
                    <li><span className="font-medium">60-79</span> – Good</li>
                    <li><span className="font-medium">40-59</span> – Fair</li>
                    <li><span className="font-medium">0-39</span> – Poor</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-card/50 border border-primary/10">
                  <h3 className="font-semibold text-primary-deep mb-2">How we score</h3>
                  <p className="text-sm text-muted-foreground">Weighted blend of wave height, swell period, and wind-chop. Targets 3–6 ft and longer periods.</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Forecast Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-transparent to-primary/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-deep mb-4">
              24-Hour Forecast
            </h2>
            <p className="text-lg text-muted-foreground">
              AI-powered predictions updated every hour
            </p>
          </div>

          {(() => {
            const hourly = (added[0]?.hourly) ?? selected?.hourly ?? spots.filter(s => !hiddenBuiltIns.has(s.city))[0]?.data?.hourly
            if (!hourly) return null
            const times: string[] | undefined = hourly?.time
            const heights: number[] | undefined = hourly?.wave_height
            const periods: number[] | undefined = hourly?.wave_period
            const wind: number[] | undefined = hourly?.wind_speed_10m
            const chartData = times && heights ? times.slice(0, 24).map((t: string, i: number) => ({
              time: new Date(t).toLocaleTimeString([], { hour: '2-digit' }),
              waveHeight: toFt(heights[i]) ?? 0,
              windSpeed: wind?.[i] ?? 0,
              period: periods?.[i] ?? 0,
              direction: ""
            })) : []
            const title = added[0]?.name ? `${added[0].name} - Today` : selected?.name ? `${selected.name} - Today` : `${spots.filter(s => !hiddenBuiltIns.has(s.city))[0]?.city ?? ''} - Today`
            return (
              <ForecastChart 
                title={title}
                data={chartData}
              />
            )
          })()}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-wave shadow-wave">
              <div className="text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-white/90">Monitoring Stations</div>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gradient-ocean shadow-wave">
              <div className="text-4xl font-bold text-white mb-2">95%</div>
              <div className="text-white/90">Forecast Accuracy</div>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gradient-wave shadow-wave">
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-white/90">Live Updates</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-deep text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Waves className="h-8 w-8 text-accent" />
            <span className="text-2xl font-bold">SurfCast</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Index