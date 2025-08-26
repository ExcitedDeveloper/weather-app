import { useState } from 'react'
import { useWeatherContext } from '../../hooks/useWeatherContext'
import { OPEN_WEATHER_ICON_URL } from '../../apis/weatherApis'
import { DailyWeather } from '../../hooks/useWeather'

interface WeatherDetailRowProps {
  label: string
  value: string
}

const WeatherDetailRow = ({ label, value }: WeatherDetailRowProps) => (
  <div className="flex items-center justify-between rounded-lg bg-white/5 p-2">
    <div className="text-sm text-white/70">{label}</div>
    <div className="text-sm font-medium text-white">{value}</div>
  </div>
)

interface DailyWeatherCardProps {
  day: DailyWeather
  isExpanded: boolean
  onToggle: () => void
}

const DailyWeatherCard = ({
  day,
  isExpanded,
  onToggle,
}: DailyWeatherCardProps) => (
  <div className="hover:bg-white/15 rounded-2xl border border-white/20 bg-white/10 shadow-xl backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
    <div
      role="button"
      tabIndex={0}
      className="cursor-pointer rounded-2xl p-6 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent"
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onToggle()
        }
      }}
    >
      <div className="grid grid-cols-5 items-center gap-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 sm:gap-3">
        <div className="text-lg font-semibold text-white sm:text-center">
          {day.dayOfWeek}
        </div>
        <div className="font-medium text-white/90 sm:text-center">
          <span className="text-xl text-white">{day.highTemp}</span>
          <span className="mx-2 text-white/60">/</span>
          <span className="text-white/80">{day.lowTemp}</span>
        </div>
        <div className="flex justify-center">
          <div className="rounded-full bg-white/10 p-2 backdrop-blur-sm">
            <img
              src={`${OPEN_WEATHER_ICON_URL}${day.icon}.png`}
              className="h-12 w-12"
              alt={`${day.description} weather icon`}
            />
          </div>
        </div>
        <div className="capitalize text-white/90 sm:text-center">
          {day.description}
        </div>
        <div className="text-sm text-white/80 sm:text-center">
          {day.windDirection} {day.windSpeed} mph
        </div>
      </div>
      <div className="mt-4 flex justify-center">
        <div
          className={`transform text-white/60 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        >
          ↓
        </div>
      </div>
    </div>
    {isExpanded && (
      <div className="border-t border-white/20 bg-white/5 p-6">
        <div className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/80">
          Detailed Information
        </div>
        <div className="grid gap-3 md:grid-cols-2 sm:grid-cols-1">
          <WeatherDetailRow label="Feels Like Min" value={day.feelsLikeMin} />
          <WeatherDetailRow label="Feels Like Max" value={day.feelsLikeMax} />
          <WeatherDetailRow label="Sunrise" value={day.sunrise} />
          <WeatherDetailRow label="Sunset" value={day.sunset} />
          <WeatherDetailRow label="Wind Gusts" value={`${day.windGusts} mph`} />
          <WeatherDetailRow
            label="Max Wind Speed"
            value={`${day.windSpeed} mph`}
          />
          <WeatherDetailRow label="Wind Direction" value={day.windDirection} />
          <WeatherDetailRow label="Precipitation" value={day.precipitation} />
        </div>
      </div>
    )}
  </div>
)

const CardList = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const { dailyWeather, loading, error } = useWeatherContext()

  const handleCardToggle = (id: string) => {
    setExpandedId((prevId) => (prevId === id ? null : id))
  }

  if (loading) {
    return (
      <div className="px-4">
        <div className="mb-6 text-2xl font-bold text-white">7-Day Forecast</div>
        <div className="space-y-4">
          {[...Array(7)].map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg"
            >
              <div className="flex items-center justify-between">
                <div className="h-6 w-24 rounded-full bg-white/20" />
                <div className="h-6 w-16 rounded-full bg-white/20" />
                <div className="h-12 w-12 rounded-full bg-white/20" />
                <div className="h-6 w-32 rounded-full bg-white/20" />
                <div className="h-6 w-20 rounded-full bg-white/20" />
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
        <div className="mb-6 text-2xl font-bold text-white">7-Day Forecast</div>
        <div className="rounded-2xl border border-red-300/30 bg-red-500/20 p-8 text-center backdrop-blur-lg">
          <div className="mb-2 text-6xl">⚠️</div>
          <div className="text-xl font-medium text-white">
            Error loading forecast
          </div>
          <div className="mt-2 text-sm text-white/80">{error}</div>
        </div>
      </div>
    )
  }

  if (!dailyWeather.length) {
    return null
  }

  return (
    <div className="px-4">
      <div className="mb-6 text-2xl font-bold text-white">7-Day Forecast</div>
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
