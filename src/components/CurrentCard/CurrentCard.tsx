import { useEffect, useContext, useState } from 'react'
import { LocationContext } from '../../contexts/LocationContext'
import {
  OPEN_WEATHER_CURRENT_API_URL,
  OPEN_WEATHER_ICON_URL,
} from '../../apis/openWeatherApi'
import './CurrentCard.css'

interface OpenWeatherDetails {
  main: {
    temp: number
    feels_like: number
    humidity: number
    pressure: number
  }
  wind: {
    speed: number
  }
}

interface CurrentWeather {
  description: string
  icon: string
}

interface WeatherDetails {
  temp: string
  feelsLike: string
  wind: string
  humidity: string
  pressure: string
}

const CurrentCard = () => {
  const { currLocation } = useContext(LocationContext)
  const [currWeather, setCurrWeather] = useState<CurrentWeather>()
  const [weatherDetails, setWeatherDetails] = useState<WeatherDetails>()

  const getWeatherDetails = (json: OpenWeatherDetails): WeatherDetails => {
    return {
      temp: `${Math.round(json.main.temp)}\u00B0F`,
      feelsLike: `${Math.round(json.main.feels_like)}\u00B0F`,
      wind: `${Math.round(json.wind.speed)}mph`,
      humidity: `${Math.round(json.main.humidity)}%`,
      pressure: `${Math.round(json.main.pressure)}hPa`,
    }
  }

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

      setCurrWeather(json.weather[0])

      setWeatherDetails(getWeatherDetails(json))
    }

    fetchCurrent()
  }, [currLocation])

  if (!weatherDetails) {
    return null
  }

  return (
    <div className="mt-5 flex h-60 w-96 flex-col rounded-lg bg-slate-500 px-3 py-5 font-sans font-bold text-white">
      <div className="flex flex-1 flex-row">
        <div className="flex-2">
          <div className="text-base">{currLocation?.label}</div>
          <div className="text-xs capitalize">{currWeather?.description}</div>
        </div>
        <div className="flex flex-1 justify-end">
          {currWeather && (
            <img
              src={`${OPEN_WEATHER_ICON_URL}${currWeather?.icon}.png`}
              className="w-30 -mt-4 h-20"
              alt="Current weather icon"
            />
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-row">
        <div className="flex-1 text-6xl">{weatherDetails?.temp}</div>

        <div className="grid flex-1 grid-cols-2 grid-rows-4 text-xs">
          <div className="col-span-2">Details</div>
          <div>Feels Like</div>
          <div>{`${weatherDetails?.feelsLike}`}</div>
          <div>Wind</div>
          <div>{`${weatherDetails?.wind}`}</div>
          <div>Humidity</div>
          <div>{`${weatherDetails?.humidity}`}</div>
          <div>Pressure</div>
          <div>{`${weatherDetails?.pressure}`}</div>
        </div>
      </div>
    </div>
  )
}

export default CurrentCard
