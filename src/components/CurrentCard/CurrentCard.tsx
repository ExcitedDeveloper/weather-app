import { useLocation } from '../../hooks/useLocation'
import { useWeatherContext } from '../../hooks/useWeatherContext'
import { OPEN_WEATHER_ICON_URL } from '../../apis/weatherApis'
import './CurrentCard.css'

const CurrentCard = () => {
  const { currLocation } = useLocation()
  const { currentWeather, loading, error } = useWeatherContext()

  if (loading) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 shadow-xl backdrop-blur-lg">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white" />
            <div className="text-xl font-medium text-white">
              Loading weather...
            </div>
            <div className="mt-2 text-sm text-white/70">Please wait</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-red-300/30 bg-red-500/20 p-8 shadow-xl backdrop-blur-lg">
        <div className="text-center">
          <div className="mb-2 text-6xl">⚠️</div>
          <div className="text-xl font-medium text-white">
            Error loading weather
          </div>
          <div className="mt-2 text-sm text-white/80">{error}</div>
        </div>
      </div>
    )
  }

  if (!currentWeather || !currLocation) {
    return null
  }

  return (
    <div className="hover:bg-white/15 w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 shadow-xl backdrop-blur-lg transition-all duration-300 hover:shadow-2xl">
      <div className="mb-6 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 text-2xl font-bold text-white">
            {currLocation.label}
          </div>
          <div className="capitalize text-white/80">
            {currentWeather.description}
          </div>
        </div>
        <div className="relative">
          <div className="rounded-full bg-white/10 p-3 backdrop-blur-sm">
            <img
              src={`${OPEN_WEATHER_ICON_URL}${currentWeather.icon}.png`}
              className="h-16 w-16"
              alt={`${currentWeather.description} weather icon`}
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-6xl font-bold text-white">
          {currentWeather.temp}
        </div>
        <div className="text-lg text-white/70">°C</div>
      </div>

      <div className="rounded-xl bg-white/5 p-4">
        <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/80">
          Details
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-white/60">Wind Speed</div>
            <div className="font-medium text-white">
              {currentWeather.wind} mph
            </div>
          </div>
          <div>
            <div className="text-white/60">Direction</div>
            <div className="font-medium text-white">
              {currentWeather.winddirection}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CurrentCard
