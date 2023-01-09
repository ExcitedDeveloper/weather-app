import { useState, useContext } from 'react'
import { WeatherContext } from '../../contexts/WeatherContext'
import { OPEN_WEATHER_ICON_URL } from '../../apis/weatherApis'

interface Card {
  id: number
  title: string
  description: string
  content: string
}

interface Props {
  items: Card[]
}

const CardList: React.FC<Props> = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const weatherDetails = useContext(WeatherContext)

  const handleCardClick = (id: string) => {
    setExpandedId((prevId) => (prevId === id ? null : id))
  }

  if (!weatherDetails) return null

  return (
    <>
      <div className="px-20 text-lg font-bold">Daily</div>
      <div className="mx-auto flex min-w-full flex-col px-20">
        {weatherDetails?.dailyWeather.map((currDay) => (
          <div
            key={currDay.id}
            className="w-100 mb-4 flex flex-col rounded-md shadow-md"
          >
            <div
              role="button"
              tabIndex={0}
              className="flex cursor-pointer flex-row flex-wrap gap-x-4 p-4"
              onClick={() => handleCardClick(currDay.id)}
              onKeyDown={() => handleCardClick(currDay.id)}
            >
              <div className="w-36">{currDay.dayOfWeek}</div>
              <div className="w-36">
                {currDay.lowTemp}/{currDay.highTemp}
              </div>
              <div className="w-36">
                <img
                  src={`${OPEN_WEATHER_ICON_URL}${currDay.icon}.png`}
                  className="w-30 -mt-4 h-20"
                  alt="Daily weather icon"
                />
              </div>
              <div className="flex-1">{currDay.description}</div>
              <div className="w-36">{`${currDay.windDirection} ${currDay.windSpeed} mph`}</div>
            </div>
            {expandedId === currDay.id && (
              <div className="grid grid-cols-3 grid-rows-2 gap-4 bg-gray-100 p-4 lg:grid-cols-2 sm:grid-cols-1">
                <div className="flex gap-x-2">
                  <div className="flex-1">Feels Like Min</div>
                  <div className="flex-1">{currDay.feelsLikeMin}</div>
                </div>
                <div className="flex gap-x-2">
                  <div className="flex-1">Sunrise</div>
                  <div className="flex-1">{currDay.sunrise}</div>
                </div>
                <div className="flex gap-x-2">
                  <div className="flex-1">Wind Speed Max</div>
                  <div className="flex-1">{currDay.windSpeed} mph</div>
                </div>
                <div className="flex gap-x-2">
                  <div className="flex-1">Wind Direction</div>
                  <div className="flex-1">{currDay.windDirection}</div>
                </div>
                <div className="flex gap-x-2">
                  <div className="flex-1">Feels Like Max</div>
                  <div className="flex-1">{currDay.feelsLikeMax}</div>
                </div>
                <div className="flex gap-x-2">
                  <div className="flex-1">Sunset</div>
                  <div className="flex-1">{currDay.sunset}</div>
                </div>
                <div className="flex gap-x-2">
                  <div className="flex-1">Wind Speed Gusts</div>
                  <div className="flex-1">{currDay.windGusts} mph</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

export default CardList
