import { useEffect, useContext, useState } from 'react'
import { LocationContext } from '../../contexts/LocationContext'
import {
  OPEN_WEATHER_CURRENT_API_URL,
  OPEN_WEATHER_ICON_URL,
} from '../../apis/openWeatherApi'
import './CurrentCard.css'

interface CurrentWeather {
  description: string
  icon: string
}

const CurrentCard = () => {
  const { currLocation } = useContext(LocationContext)
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather>()

  useEffect(() => {
    const fetchCurrent = async () => {
      if (!currLocation) return

      const url = `${OPEN_WEATHER_CURRENT_API_URL}?lat=${
        currLocation.latitude
      }&lon=${currLocation.longitude}&units=imperial&appid=${
        import.meta.env.VITE_OPEN_WEATHER_API_KEY
      }`

      const response = await fetch(url)

      const json = await response.json()

      setCurrentWeather(json.weather[0])

      console.log(`******** current weather json`, json)
    }

    fetchCurrent()
  }, [currLocation])

  console.log(`******** currentWeather`, currentWeather)

  return (
    <div className="mt-5 flex h-60 w-96 flex-col rounded-lg bg-slate-600 px-3 py-5 font-sans font-bold text-white">
      <div className="flex flex-1 flex-row">
        <div className="flex-2">
          <div className="text-base">{currLocation?.label}</div>
          <div className="text-xs capitalize">
            {currentWeather?.description}
          </div>
        </div>
        <div className="flex flex-1 justify-end">
          {currentWeather && (
            <img
              src={`${OPEN_WEATHER_ICON_URL}${currentWeather?.icon}.png`}
              className="w-30 -mt-4 h-20"
              alt="Current weather icon"
            />
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-row">
        <div className="flex-1" style={{ border: '1px solid red' }}>
          pqieupewqoi
        </div>
        <div className="flex-1" style={{ border: '1px solid red' }}>
          ;alkdjfs;
        </div>
      </div>
    </div>
  )
}

export default CurrentCard
