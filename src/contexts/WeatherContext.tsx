import {
  useEffect,
  createContext,
  useState,
  ReactNode,
  useContext,
} from 'react'
import { OPEN_METEO_URL } from '../apis/weatherApis'
import { wmoToDescription, wmoToOpenWeatherIcon } from '../util/weather'
import { LocationContext } from './LocationContext'

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

// interface DailyWeather {
//   //
// }

export interface WeatherDetails {
  currentWeather?: CurrentWeather
  // dailyWeather: DailyWeather[]
}

export interface WeatherContextProps {
  weatherDetails?: WeatherDetails
}

export const WeatherContext = createContext<WeatherDetails | undefined>({
  currentWeather: undefined,
})

export interface WeatherProviderProps {
  children: ReactNode
}

enum DayOrNight {
  Day,
  Night,
}

const getDayOrNight = (json: OpenMeteo): DayOrNight => {
  const currTime = new Date(json.current_weather.time)
  const sunrise = new Date(json.daily.sunrise[0])
  const sunset = new Date(json.daily.sunset[0])

  return currTime >= sunrise && currTime < sunset
    ? DayOrNight.Day
    : DayOrNight.Night
}

export const WeatherProvider = ({ children }: WeatherProviderProps) => {
  const { currLocation } = useContext(LocationContext)
  const [weatherDetails, setWeatherDetails] = useState<WeatherDetails>()

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

      const newWeather: WeatherDetails = {
        currentWeather: getCurrentWeather(json),
      }

      setWeatherDetails(newWeather)
    }

    fetchCurrent()
  }, [currLocation])

  return (
    <WeatherContext.Provider value={weatherDetails}>
      {children}
    </WeatherContext.Provider>
  )
}
