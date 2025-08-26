import { useState } from 'react'
import { useWeatherContext } from '../../hooks/useWeatherContext'
import { useTheme } from '../../hooks/useTheme'
import { OPEN_WEATHER_ICON_URL } from '../../apis/weatherApis'
import { DailyWeather } from '../../hooks/useWeather'

interface WeatherDetailRowProps {
  label: string
  value: string
}

const WeatherDetailRow = ({ label, value }: WeatherDetailRowProps) => {
  const { theme } = useTheme()

  return (
    <div
      className={`flex items-center justify-between rounded-lg p-2 transition-all duration-500 ${
        theme === 'dark' ? 'bg-white/5' : 'bg-gray-200/30'
      }`}
    >
      <div
        className={`text-sm transition-colors duration-500 ${
          theme === 'dark' ? 'text-white/70' : 'text-gray-600'
        }`}
      >
        {label}
      </div>
      <div
        className={`text-sm font-medium transition-colors duration-500 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}
      >
        {value}
      </div>
    </div>
  )
}

interface DailyWeatherCardProps {
  day: DailyWeather
  isExpanded: boolean
  onToggle: () => void
}

const DailyWeatherCard = ({
  day,
  isExpanded,
  onToggle,
}: DailyWeatherCardProps) => {
  const { theme } = useTheme()

  return (
    <div
      className={`rounded-2xl border shadow-xl backdrop-blur-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${
        theme === 'dark'
          ? 'hover:bg-white/15 border-white/20 bg-white/10'
          : 'border-gray-300/30 bg-white/80 hover:bg-white/90'
      }`}
    >
      <div
        role="button"
        tabIndex={0}
        className={`cursor-pointer rounded-2xl p-6 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent ${
          theme === 'dark' ? 'focus:ring-white/50' : 'focus:ring-blue-500/50'
        }`}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onToggle()
          }
        }}
      >
        <div className="grid grid-cols-5 items-center gap-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 sm:gap-3">
          <div
            className={`text-lg font-semibold transition-colors duration-500 sm:text-center ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            {day.dayOfWeek}
          </div>
          <div
            className={`font-medium transition-colors duration-500 sm:text-center ${
              theme === 'dark' ? 'text-white/90' : 'text-gray-800'
            }`}
          >
            <span
              className={`text-xl transition-colors duration-500 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              {day.highTemp}
            </span>
            <span
              className={`mx-2 transition-colors duration-500 ${
                theme === 'dark' ? 'text-white/60' : 'text-gray-500'
              }`}
            >
              /
            </span>
            <span
              className={`transition-colors duration-500 ${
                theme === 'dark' ? 'text-white/80' : 'text-gray-700'
              }`}
            >
              {day.lowTemp}
            </span>
          </div>
          <div className="flex justify-center">
            <div
              className={`rounded-full p-2 backdrop-blur-sm transition-all duration-500 ${
                theme === 'dark' ? 'bg-white/10' : 'bg-gray-200/50'
              }`}
            >
              <img
                src={`${OPEN_WEATHER_ICON_URL}${day.icon}.png`}
                className="h-12 w-12"
                alt={`${day.description} weather icon`}
              />
            </div>
          </div>
          <div
            className={`capitalize transition-colors duration-500 sm:text-center ${
              theme === 'dark' ? 'text-white/90' : 'text-gray-800'
            }`}
          >
            {day.description}
          </div>
          <div
            className={`text-sm transition-colors duration-500 sm:text-center ${
              theme === 'dark' ? 'text-white/80' : 'text-gray-700'
            }`}
          >
            {day.windDirection} {day.windSpeed} mph
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <div
            className={`transform transition-all duration-500 ${
              isExpanded ? 'rotate-180' : ''
            } ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}
          >
            ↓
          </div>
        </div>
      </div>
      {isExpanded && (
        <div
          className={`border-t p-6 transition-all duration-500 ${
            theme === 'dark'
              ? 'border-white/20 bg-white/5'
              : 'border-gray-300/30 bg-gray-100/50'
          }`}
        >
          <div
            className={`mb-4 text-sm font-semibold uppercase tracking-wide transition-colors duration-500 ${
              theme === 'dark' ? 'text-white/80' : 'text-gray-700'
            }`}
          >
            Detailed Information
          </div>
          <div className="grid gap-3 md:grid-cols-2 sm:grid-cols-1">
            <WeatherDetailRow label="Feels Like Min" value={day.feelsLikeMin} />
            <WeatherDetailRow label="Feels Like Max" value={day.feelsLikeMax} />
            <WeatherDetailRow label="Sunrise" value={day.sunrise} />
            <WeatherDetailRow label="Sunset" value={day.sunset} />
            <WeatherDetailRow
              label="Wind Gusts"
              value={`${day.windGusts} mph`}
            />
            <WeatherDetailRow
              label="Max Wind Speed"
              value={`${day.windSpeed} mph`}
            />
            <WeatherDetailRow
              label="Wind Direction"
              value={day.windDirection}
            />
            <WeatherDetailRow label="Precipitation" value={day.precipitation} />
          </div>
        </div>
      )}
    </div>
  )
}

const CardList = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const { dailyWeather, loading, error } = useWeatherContext()
  const { theme } = useTheme()

  const handleCardToggle = (id: string) => {
    setExpandedId((prevId) => (prevId === id ? null : id))
  }

  if (loading) {
    return (
      <div className="px-4">
        <div
          className={`mb-6 text-2xl font-bold transition-colors duration-500 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          7-Day Forecast
        </div>
        <div className="space-y-4">
          {[...Array(7)].map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className={`animate-pulse rounded-2xl border p-6 backdrop-blur-lg transition-all duration-500 ${
                theme === 'dark'
                  ? 'border-white/10 bg-white/5'
                  : 'border-gray-300/20 bg-gray-100/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`h-6 w-24 rounded-full ${
                    theme === 'dark' ? 'bg-white/20' : 'bg-gray-300/40'
                  }`}
                />
                <div
                  className={`h-6 w-16 rounded-full ${
                    theme === 'dark' ? 'bg-white/20' : 'bg-gray-300/40'
                  }`}
                />
                <div
                  className={`h-12 w-12 rounded-full ${
                    theme === 'dark' ? 'bg-white/20' : 'bg-gray-300/40'
                  }`}
                />
                <div
                  className={`h-6 w-32 rounded-full ${
                    theme === 'dark' ? 'bg-white/20' : 'bg-gray-300/40'
                  }`}
                />
                <div
                  className={`h-6 w-20 rounded-full ${
                    theme === 'dark' ? 'bg-white/20' : 'bg-gray-300/40'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4">
        <div
          className={`mb-6 text-2xl font-bold transition-colors duration-500 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          7-Day Forecast
        </div>
        <div
          className={`rounded-2xl border border-red-300/30 p-8 text-center backdrop-blur-lg transition-all duration-500 ${
            theme === 'dark' ? 'bg-red-500/20' : 'bg-red-100/80'
          }`}
        >
          <div className="mb-2 text-6xl">⚠️</div>
          <div
            className={`text-xl font-medium transition-colors duration-500 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            Error loading forecast
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

  if (!dailyWeather.length) {
    return null
  }

  return (
    <div className="px-4">
      <div
        className={`mb-6 text-2xl font-bold transition-colors duration-500 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}
      >
        7-Day Forecast
      </div>
      <div className="space-y-4">
        {dailyWeather.map((day) => (
          <DailyWeatherCard
            key={day.id}
            day={day}
            isExpanded={expandedId === day.id}
            onToggle={() => handleCardToggle(day.id)}
          />
        ))}
      </div>
    </div>
  )
}

export default CardList
