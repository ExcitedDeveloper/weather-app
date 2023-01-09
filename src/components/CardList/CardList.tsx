import { useState, useContext } from 'react'
import { WeatherContext } from '../../contexts/WeatherContext'
import { OPEN_WEATHER_ICON_URL } from '../../apis/weatherApis'
// import 'tailwindcss/dist/base.css'
// import 'tailwindcss/dist/components.css'

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
              className="flex cursor-pointer flex-row p-4"
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
              <div className="bg-gray-100 p-4">
                <p className="text-gray-800">{currDay.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

export default CardList
