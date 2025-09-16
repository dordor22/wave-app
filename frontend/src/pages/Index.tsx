import { Button } from "@/components/ui/button"
import { SurfConditionsCard } from "@/components/SurfConditionsCard"
import { ForecastChart } from "@/components/ForecastChart"
import { Waves, Wind, Thermometer, Eye, MapPin, Clock, Activity } from "lucide-react"
import heroWave from "@/assets/hero-wave.jpg"

const surfSpots = [
  {
    location: "Malibu Beach",
    lastUpdated: "5 mins ago",
    conditions: [
      { title: "Wave Height", value: "4-6", unit: "ft", status: "excellent" as const, icon: Waves },
      { title: "Wind Speed", value: "8", unit: "mph", status: "good" as const, icon: Wind },
      { title: "Water Temp", value: "68", unit: "°F", status: "good" as const, icon: Thermometer },
      { title: "Visibility", value: "15", unit: "mi", status: "excellent" as const, icon: Eye },
    ]
  },
  {
    location: "Huntington Pier", 
    lastUpdated: "3 mins ago",
    conditions: [
      { title: "Wave Height", value: "2-3", unit: "ft", status: "fair" as const, icon: Waves },
      { title: "Wind Speed", value: "12", unit: "mph", status: "fair" as const, icon: Wind },
      { title: "Water Temp", value: "66", unit: "°F", status: "good" as const, icon: Thermometer },
      { title: "Visibility", value: "12", unit: "mi", status: "good" as const, icon: Eye },
    ]
  },
  {
    location: "Santa Monica",
    lastUpdated: "7 mins ago", 
    conditions: [
      { title: "Wave Height", value: "3-4", unit: "ft", status: "good" as const, icon: Waves },
      { title: "Wind Speed", value: "6", unit: "mph", status: "excellent" as const, icon: Wind },
      { title: "Water Temp", value: "67", unit: "°F", status: "good" as const, icon: Thermometer },
      { title: "Visibility", value: "18", unit: "mi", status: "excellent" as const, icon: Eye },
    ]
  }
]

const forecastData = [
  { time: "6 AM", waveHeight: 4, windSpeed: 8, period: 12, direction: "SW" },
  { time: "9 AM", waveHeight: 5, windSpeed: 10, period: 14, direction: "SW" },
  { time: "12 PM", waveHeight: 6, windSpeed: 12, period: 16, direction: "W" },
  { time: "3 PM", waveHeight: 5, windSpeed: 15, period: 14, direction: "W" },
  { time: "6 PM", waveHeight: 4, windSpeed: 13, period: 12, direction: "NW" },
]

const Index = () => {
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="ocean" size="lg" className="text-lg px-8 py-4">
                <Activity className="mr-2 h-5 w-5" />
                View Live Conditions
              </Button>
              <Button variant="wave" size="lg" className="text-lg px-8 py-4">
                <MapPin className="mr-2 h-5 w-5" />
                Find Surf Spots
              </Button>
            </div>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {surfSpots.map((spot, index) => (
              <SurfConditionsCard
                key={index}
                location={spot.location}
                conditions={spot.conditions}
                lastUpdated={spot.lastUpdated}
              />
            ))}
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

          <ForecastChart 
            title="Malibu Beach - Today"
            data={forecastData}
          />
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
          <p className="text-white/70 mb-8">
            Powered by AWS Lambda, Kubernetes, and AI-driven forecasting technology
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-white/60">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Real-time APIs
            </span>
            <span>DevOps Infrastructure</span>
            <span>Machine Learning Predictions</span>
            <span>Canary Deployments</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Index