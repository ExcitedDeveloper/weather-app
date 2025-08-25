import { useState } from 'react'
import { useWeatherContext } from '../../hooks/useWeatherContext'
import { OPEN_WEATHER_ICON_URL } from '../../apis/weatherApis'
import useWindowSize from '../../hooks/useWindowSize'
import { DailyWeather } from '../../hooks/useWeather'

interface WeatherDetailRowProps {
  label: string
  value: string
}

const WeatherDetailRow = ({ label, value }: WeatherDetailRowProps) => (
  <div className="flex gap-x-2">
    <div className="flex-1">{label}</div>
    <div className="flex-1">{value}</div>
  </div>
)

interface DailyWeatherCardProps {
  day: DailyWeather
  isExpanded: boolean
  onToggle: () => void
  isDesktop: boolean
}

const DailyWeatherCard = ({
  day,
  isExpanded,
  onToggle,
  isDesktop,
}: DailyWeatherCardProps) => (
  <div className="w-100 mb-4 flex flex-col rounded-md shadow-md">
    <div
      role="button"
      tabIndex={0}
      className="flex cursor-pointer flex-row flex-wrap gap-x-4 p-4 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onToggle()
        }
      }}
    >
      <div className="w-32 font-medium">{day.dayOfWeek}</div>
      <div className="w-32">
        {day.lowTemp}/{day.highTemp}
      </div>
      <div className="w-32 flex-none">
        <img
          src={`${OPEN_WEATHER_ICON_URL}${day.icon}.png`}
          className="-mt-4 h-20"
          alt={`${day.description} weather icon`}
        />
      </div>
      <div className="flex-1">{day.description}</div>
      <div className="w-32">
        {day.windDirection} {day.windSpeed} mph
      </div>
    </div>
    {isExpanded && (
      <div
        className={`grid gap-4 overflow-hidden bg-gray-100 p-4 ${
          isDesktop ? 'grid-cols-3 grid-rows-2 lg:grid-cols-2' : ''
        } sm:grid-cols-1`}
      >
        <WeatherDetailRow label="Feels Like Min" value={day.feelsLikeMin} />
        <WeatherDetailRow label="Feels Like Max" value={day.feelsLikeMax} />
        <WeatherDetailRow label="Sunrise" value={day.sunrise} />
        <WeatherDetailRow label="Sunset" value={day.sunset} />
        <WeatherDetailRow
          label="Wind Speed Gusts"
          value={`${day.windGusts} mph`}
        />
        <WeatherDetailRow
          label="Wind Speed Max"
          value={`${day.windSpeed} mph`}
        />
        <WeatherDetailRow label="Wind Direction" value={day.windDirection} />
        <WeatherDetailRow label="Precipitation" value={day.precipitation} />
      </div>
    )}
  </div>
)

const CardList = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const { dailyWeather, loading, error } = useWeatherContext()
  const windowSize = useWindowSize()

  const handleCardToggle = (id: string) => {
    setExpandedId((prevId) => (prevId === id ? null : id))
  }

  const isDesktop = !windowSize.width || windowSize.width >= 1024

  if (loading) {
    return (
      <div className="px-20">
        <div className="mb-4 text-lg font-bold">Daily</div>
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-20">
        <div className="mb-4 text-lg font-bold">Daily</div>
        <div className="py-8 text-center text-red-600">
          Error loading daily weather: {error}
        </div>
      </div>
    )
  }

  if (!dailyWeather.length) {
    return null
  }

  return (
    <>
      <div className="px-20 text-lg font-bold">Daily</div>
      <div className="mx-auto flex min-w-full flex-col px-20">
        {dailyWeather.map((day) => (
          <DailyWeatherCard
            key={day.id}
            day={day}
            isExpanded={expandedId === day.id}
            onToggle={() => handleCardToggle(day.id)}
            isDesktop={isDesktop}
          />
        ))}
      </div>
    </>
  )
}

export default CardList
