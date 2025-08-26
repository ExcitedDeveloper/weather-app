import { useLocation } from '../../hooks/useLocation'
import { useWeatherContext } from '../../hooks/useWeatherContext'
import { useTheme } from '../../hooks/useTheme'
import { OPEN_WEATHER_ICON_URL } from '../../apis/weatherApis'
import './CurrentCard.css'

const CurrentCard = () => {
  const { currLocation } = useLocation()
  const { currentWeather, loading, error } = useWeatherContext()
  const { theme } = useTheme()

  if (loading) {
    return (
      <div
        className={`w-full max-w-md rounded-2xl border p-8 shadow-xl backdrop-blur-lg transition-all duration-500 ${
          theme === 'dark'
            ? 'border-white/20 bg-white/10'
            : 'border-gray-300/30 bg-white/80'
        }`}
      >
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div
              className={`mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 ${
                theme === 'dark'
                  ? 'border-white/20 border-t-white'
                  : 'border-gray-300/30 border-t-gray-700'
              }`}
            />
            <div
              className={`text-xl font-medium transition-colors duration-500 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              Loading weather...
            </div>
            <div
              className={`mt-2 text-sm transition-colors duration-500 ${
                theme === 'dark' ? 'text-white/70' : 'text-gray-600'
              }`}
            >
              Please wait
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className={`w-full max-w-md rounded-2xl border border-red-300/30 p-8 shadow-xl backdrop-blur-lg transition-all duration-500 ${
          theme === 'dark' ? 'bg-red-500/20' : 'bg-red-100/80'
        }`}
      >
        <div className="text-center">
          <div className="mb-2 text-6xl">⚠️</div>
          <div
            className={`text-xl font-medium transition-colors duration-500 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            Error loading weather
          </div>
          <div
            className={`mt-2 text-sm transition-colors duration-500 ${
              theme === 'dark' ? 'text-white/80' : 'text-gray-700'
            }`}
          >
            {error}
          </div>
        </div>
      </div>
    )
  }

  if (!currentWeather || !currLocation) {
    return null
  }

  return (
    <div
      className={`w-full max-w-md rounded-2xl border p-8 shadow-xl backdrop-blur-lg transition-all duration-500 hover:shadow-2xl ${
        theme === 'dark'
          ? 'hover:bg-white/15 border-white/20 bg-white/10'
          : 'border-gray-300/30 bg-white/80 hover:bg-white/90'
      }`}
    >
      <div className="mb-6 flex items-start justify-between">
        <div className="flex-1">
          <div
            className={`mb-2 text-2xl font-bold transition-colors duration-500 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            {currLocation.label}
          </div>
          <div
            className={`capitalize transition-colors duration-500 ${
              theme === 'dark' ? 'text-white/80' : 'text-gray-600'
            }`}
          >
            {currentWeather.description}
          </div>
        </div>
        <div className="relative">
          <div
            className={`rounded-full p-3 backdrop-blur-sm transition-all duration-500 ${
              theme === 'dark' ? 'bg-white/10' : 'bg-gray-200/50'
            }`}
          >
            <img
              src={`${OPEN_WEATHER_ICON_URL}${currentWeather.icon}.png`}
              className="h-16 w-16"
              alt={`${currentWeather.description} weather icon`}
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div
          className={`text-6xl font-bold transition-colors duration-500 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          {currentWeather.temp}
        </div>
        <div
          className={`text-lg transition-colors duration-500 ${
            theme === 'dark' ? 'text-white/70' : 'text-gray-600'
          }`}
        >
          °C
        </div>
      </div>

      <div
        className={`rounded-xl p-4 transition-all duration-500 ${
          theme === 'dark' ? 'bg-white/5' : 'bg-gray-200/30'
        }`}
      >
        <div
          className={`mb-3 text-sm font-semibold uppercase tracking-wide transition-colors duration-500 ${
            theme === 'dark' ? 'text-white/80' : 'text-gray-700'
          }`}
        >
          Details
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div
              className={`transition-colors duration-500 ${
                theme === 'dark' ? 'text-white/60' : 'text-gray-500'
              }`}
            >
              Wind Speed
            </div>
            <div
              className={`font-medium transition-colors duration-500 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              {currentWeather.wind} mph
            </div>
          </div>
          <div>
            <div
              className={`transition-colors duration-500 ${
                theme === 'dark' ? 'text-white/60' : 'text-gray-500'
              }`}
            >
              Direction
            </div>
            <div
              className={`font-medium transition-colors duration-500 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              {currentWeather.winddirection}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CurrentCard
