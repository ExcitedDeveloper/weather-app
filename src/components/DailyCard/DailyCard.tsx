import { useEffect, useContext, useState } from 'react'
import { LocationContext } from '../../contexts/LocationContext'
import {
  OPEN_WEATHER_DAILY_API_URL,
  OPEN_WEATHER_ICON_URL,
} from '../../apis/openWeatherApi'
import './DailyCard.css'

interface DailyWeather {
  description: string
  icon: string
}

const DailyCard = () => {
  const { currLocation } = useContext(LocationContext)
  const [dailyWeather, setDailyWeather] = useState<DailyWeather>()

  useEffect(() => {
    const fetchDaily = async () => {
      if (!currLocation) return

      const url = `${OPEN_WEATHER_DAILY_API_URL}?lat=${
        currLocation.latitude
      }&lon=${currLocation.longitude}&appid=${
        import.meta.env.VITE_OPEN_WEATHER_API_KEY
      }`

      const response = await fetch(url)

      const json = await response.json()

      setDailyWeather(json.weather[0])

      console.log(`******** daily json`, json)
    }

    fetchDaily()
  }, [currLocation])

  console.log(`******** dailyWeather`, dailyWeather)

  return (
    <div className="mt-5 flex h-60 w-96 flex-col rounded-lg bg-indigo-500 px-3 py-5 font-sans font-bold text-white">
      <div className="relative flex flex-col">
        <div className="absolute top-0 left-0">
          <div className="text-base">{currLocation?.label}</div>
          <div className="text-xs capitalize">{dailyWeather?.description}</div>
        </div>
        <div className="absolute -top-5 right-0">
          {dailyWeather && (
            <img
              src={`${OPEN_WEATHER_ICON_URL}${dailyWeather?.icon}.png`}
              className="w-30 h-20"
              alt="Daily weather icon"
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default DailyCard
