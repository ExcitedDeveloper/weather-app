/* eslint-disable @typescript-eslint/no-use-before-define */
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
import { DAYS_OF_WEEK, MIN_PRECIP } from '../util/constants'
import { DayOrNight } from '../util/enums'

export const WeatherContext = createContext<WeatherDetails | undefined>({
  currentWeather: undefined,
  dailyWeather: [],
})

export const WeatherProvider = ({ children }: WeatherProviderProps) => {
  const { currLocation } = useContext(LocationContext)
  const [weatherDetails, setWeatherDetails] = useState<WeatherDetails>()

  useEffect(() => {
    const getCurrentWeatherIcon = (
      weathercode: number,
      time: string,
      sunrise: string,
      sunset: string,
      dayOrNight: DayOrNight | undefined = undefined
    ): string => {
      let dayNight
      if (dayOrNight) {
        dayNight = dayOrNight
      } else {
        dayNight = getDayOrNight(time, sunrise, sunset)
      }

      return `${wmoToOpenWeatherIcon[weathercode]}${dayNight}`
    }

    const getCurrentWeather = (json: OpenMeteo): CurrentWeather => {
      return {
        description: wmoToDescription[json.current_weather.weathercode],
        icon: getCurrentWeatherIcon(
          json.current_weather.weathercode,
          json.current_weather.time,
          json.daily.sunrise[0],
          json.daily.sunset[0]
        ),
        temp: `${Math.round(json.current_weather.temperature)}\u00B0F`,
        wind: `${Math.round(json.current_weather.windspeed)}mph`,
        winddirection: `${degToCompass(
          Math.round(json.current_weather.winddirection)
        )}`,
      }
    }

    const getDayOfWeek = (time: string): string => {
      return DAYS_OF_WEEK[new Date(time).getDay()]
    }

    const getDailyWeather = (json: OpenMeteo): Partial<DailyWeather>[] => {
      // daily has the current weather in the first elements of all
      // it's sub arrays.  Therefor the daily weather data starts at
      // index one.
      //
      // Use slice(1) to map over the proper daily weather times.
      // Add one to the indexes of the other arrays to get the
      // corresponding data in the other arrays.
      return json.daily.time.slice(2).map((time, index) => ({
        icon: getCurrentWeatherIcon(
          json.daily.weathercode[index + 1],
          time,
          json.daily.sunrise[index + 1],
          json.daily.sunset[index + 1],
          DayOrNight.Day
        ),
        dayOfWeek: getDayOfWeek(time),
        description: wmoToDescription[json.daily.weathercode[index + 1]],
        lowTemp: `${Math.round(
          json.daily.temperature_2m_min[index + 1]
        )}\u00B0F`,
        highTemp: `${Math.round(
          json.daily.temperature_2m_max[index + 1]
        )}\u00B0F`,
        feelsLikeMin: `${Math.round(
          json.daily.apparent_temperature_min[index + 1]
        )}\u00B0F`,
        feelsLikeMax: `${Math.round(
          json.daily.apparent_temperature_max[index + 1]
        )}\u00B0F`,
        precipitation: getPrecipitation(
          json.daily.precipitation_sum[index + 1]
        ),
        sunrise: new Date(json.daily.sunrise[index + 1]).toLocaleTimeString(),
        sunset: new Date(json.daily.sunset[index + 1]).toLocaleTimeString(),
        windDirection: `${degToCompass(
          json.daily.winddirection_10m_dominant[index + 1]
        )}`,
        windGusts: `${Math.round(json.daily.windgusts_10m_max[index + 1])}mph`,
        windSpeed: `${Math.round(json.daily.windspeed_10m_max[index + 1])}mph`,
      }))
    }

    const fetchWeatherDetails = async () => {
      if (!currLocation) return

      const today = new Date()

      const forecastStartDate = today.toISOString().substring(0, 10)

      const todayPlus8 = today
      todayPlus8.setDate(today.getDate() + 8)
      const forecastEndDate = todayPlus8.toISOString().substring(0, 10)

      const url = `${OPEN_METEO_URL}&latitude=${currLocation.latitude}&longitude=${currLocation.longitude}&start_date=${forecastStartDate}&end_date=${forecastEndDate}`

      const response = await fetch(url)

      const json = await response.json()

      const newWeather: WeatherDetails = {
        currentWeather: getCurrentWeather(json),
        dailyWeather: getDailyWeather(json),
      }

      setWeatherDetails(newWeather)
    }

    fetchWeatherDetails()
  }, [currLocation])

  return (
    <WeatherContext.Provider value={weatherDetails}>
      {children}
    </WeatherContext.Provider>
  )
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
    apparent_temperature_max: number[]
    apparent_temperature_min: number[]
    precipitation_hours: number[]
    precipitation_sum: number[]
    rain_sum: (number | null)[]
    showers_sum: (number | null)[]
    snowfall_sum: (number | null)[]
    sunrise: string[]
    sunset: string[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    time: string[]
    weathercode: number[]
    winddirection_10m_dominant: number[]
    windgusts_10m_max: number[]
    windspeed_10m_max: number[]
  }
}

interface CurrentWeather {
  description: string
  icon: string
  temp: string
  wind: string
  winddirection: string
}

interface DailyWeather {
  icon: string
  dayOfWeek: string
  description: string
  lowTemp: string
  highTemp: string

  feelsLikeMin: string
  feelsLikeMax: string
  precipitation: string
  sunrise: string
  sunset: string
  windDirection: string
  windGusts: string
  windSpeed: string
}

export interface WeatherDetails {
  currentWeather?: CurrentWeather
  dailyWeather: Partial<DailyWeather>[]
}

export interface WeatherContextProps {
  weatherDetails?: WeatherDetails
}

export interface WeatherProviderProps {
  children: ReactNode
}

function getDayOrNight(
  time: string,
  sunriseStr: string,
  sunsetStr: string
): DayOrNight {
  const currTime = new Date(time)
  const sunrise = new Date(sunriseStr)
  const sunset = new Date(sunsetStr)

  return currTime >= sunrise && currTime < sunset
    ? DayOrNight.Day
    : DayOrNight.Night
}

function getPrecipitation(num: number): string {
  return num < MIN_PRECIP ? 'trace' : `${num.toFixed(2)}in`
}

function degToCompass(num: number) {
  const val = Math.floor(num / 22.5 + 0.5)
  const arr = [
    'N',
    'NNE',
    'NE',
    'ENE',
    'E',
    'ESE',
    'SE',
    'SSE',
    'S',
    'SSW',
    'SW',
    'WSW',
    'W',
    'WNW',
    'NW',
    'NNW',
  ]
  return arr[val % 16]
}
