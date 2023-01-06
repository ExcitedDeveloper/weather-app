import { useEffect, useContext, useState } from 'react'
import { LocationContext } from '../../contexts/LocationContext'
import { OPEN_METEO_URL, OPEN_WEATHER_ICON_URL } from '../../apis/weatherApis'
import { wmoToDescription, wmoToOpenWeatherIcon } from '../../util/weather'
import './CurrentCard.css'

enum DayOrNight {
  Day,
  Night,
}

interface OpenMeteo {
  current_weather: {
    temperature: number
    windspeed: number
    winddirection: number
    weathercode: number
    time: string
  }
  daily: {
    sunrise: string[]
    sunset: string[]
  }
}

interface CurrentWeather {
  description: string
  icon: string
  temp: string
  wind: string
  winddirection: string
}

const CurrentCard = () => {
  const { currLocation } = useContext(LocationContext)
  const [currWeather, setCurrWeather] = useState<CurrentWeather>()

  const getDayOrNight = (json: OpenMeteo): DayOrNight => {
    const currTime = new Date(json.current_weather.time)
    const sunrise = new Date(json.daily.sunrise[0])
    const sunset = new Date(json.daily.sunset[0])

    return currTime >= sunrise && currTime < sunset
      ? DayOrNight.Day
      : DayOrNight.Night
  }

  useEffect(() => {
    const getCurrentWeatherIcon = (json: OpenMeteo): string => {
      // First need to figure out if it is day or night
      const dayNight = getDayOrNight(json) === DayOrNight.Day ? 'd' : 'n'

      return `${
        wmoToOpenWeatherIcon[json.current_weather.weathercode]
      }${dayNight}`
    }

    const getCurrentWeather = (json: OpenMeteo): CurrentWeather => {
      return {
        description: wmoToDescription[json.current_weather.weathercode],
        icon: getCurrentWeatherIcon(json),
        temp: `${Math.round(json.current_weather.temperature)}\u00B0F`,
        wind: `${Math.round(json.current_weather.windspeed)}mph`,
        winddirection: `${Math.round(
          json.current_weather.winddirection
        )}\u00B0`,
      }
    }

    const fetchCurrent = async () => {
      if (!currLocation) return

      const url = `${OPEN_METEO_URL}&latitude=${currLocation.latitude}&longitude=${currLocation.longitude}`

      const response = await fetch(url)

      const json = await response.json()

      setCurrWeather(getCurrentWeather(json))
    }

    fetchCurrent()
  }, [currLocation])

  if (!currWeather) {
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
        <div className="flex-1 text-6xl">{currWeather.temp}</div>

        <div className="grid flex-1 grid-cols-[2fr_1fr] grid-rows-3 text-xs">
          <div className="col-span-2">Details</div>
          <div>Wind</div>
          <div>{`${currWeather.wind}`}</div>
          <div>Wind Direction</div>
          <div>{`${currWeather.winddirection}`}</div>
        </div>
      </div>
    </div>
  )
}

export default CurrentCard
