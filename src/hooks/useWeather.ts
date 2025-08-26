import { useState, useEffect, useCallback } from 'react'
import { Location } from '../contexts/LocationContext'
import { OPEN_METEO_URL } from '../apis/weatherApis'
import {
  getWeatherIcon,
  formatTemperature,
  formatWindSpeed,
  degToCompass,
  getWeatherDescription,
  getDayOfWeek,
  formatPrecipitation,
  formatTime,
} from '../util/weather-utils'
import { getForecastDateRange } from '../util/date-utils'
import { fetchWithErrorHandling, buildUrlWithParams } from '../util/api-utils'
import { DayOrNight } from '../util/enums'

export interface CurrentWeather {
  description: string
  icon: string
  temp: string
  wind: string
  winddirection: string
}

export interface DailyWeather {
  id: string
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
  dailyWeather: DailyWeather[]
}

interface OpenMeteoResponse {
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

/**
 * Custom hook for managing weather data
 */
export const useWeather = (location: Location | undefined) => {
  const [weatherDetails, setWeatherDetails] = useState<WeatherDetails>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const transformCurrentWeather = (
    data: OpenMeteoResponse
  ): CurrentWeather => ({
    description: getWeatherDescription(data.current_weather.weathercode),
    icon: getWeatherIcon(
      data.current_weather.weathercode,
      data.current_weather.time,
      data.daily.sunrise[0],
      data.daily.sunset[0]
    ),
    temp: formatTemperature(data.current_weather.temperature),
    wind: formatWindSpeed(data.current_weather.windspeed),
    winddirection: degToCompass(data.current_weather.winddirection),
  })

  const transformDailyWeather = (data: OpenMeteoResponse): DailyWeather[] => {
    // Skip current day and tomorrow, show next 6 days
    return data.daily.time.slice(2).map((time, index) => ({
      id: crypto.randomUUID(),
      icon: getWeatherIcon(
        data.daily.weathercode[index + 1],
        time,
        data.daily.sunrise[index + 1],
        data.daily.sunset[index + 1],
        DayOrNight.Day
      ),
      dayOfWeek: getDayOfWeek(time),
      description: getWeatherDescription(data.daily.weathercode[index + 1]),
      lowTemp: formatTemperature(data.daily.temperature_2m_min[index + 1]),
      highTemp: formatTemperature(data.daily.temperature_2m_max[index + 1]),
      feelsLikeMin: formatTemperature(
        data.daily.apparent_temperature_min[index + 1]
      ),
      feelsLikeMax: formatTemperature(
        data.daily.apparent_temperature_max[index + 1]
      ),
      precipitation: formatPrecipitation(
        data.daily.precipitation_sum[index + 1]
      ),
      sunrise: formatTime(data.daily.sunrise[index + 1]),
      sunset: formatTime(data.daily.sunset[index + 1]),
      windDirection: degToCompass(
        data.daily.winddirection_10m_dominant[index + 1]
      ),
      windGusts: formatWindSpeed(data.daily.windgusts_10m_max[index + 1]),
      windSpeed: formatWindSpeed(data.daily.windspeed_10m_max[index + 1]),
    }))
  }

  const fetchWeatherData = useCallback(async () => {
    if (!location?.latitude || !location?.longitude) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { startDate, endDate } = getForecastDateRange()
      const url = buildUrlWithParams(OPEN_METEO_URL, {
        latitude: location.latitude,
        longitude: location.longitude,
        start_date: startDate,
        end_date: endDate,
      })

      const data = await fetchWithErrorHandling<OpenMeteoResponse>(url)

      const newWeatherDetails: WeatherDetails = {
        currentWeather: transformCurrentWeather(data),
        dailyWeather: transformDailyWeather(data),
      }

      setWeatherDetails(newWeatherDetails)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch weather data'
      setError(errorMessage)
      console.error('Weather fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [location])

  useEffect(() => {
    fetchWeatherData()
  }, [location, fetchWeatherData])

  return {
    weatherDetails,
    loading,
    error,
    refetch: fetchWeatherData,
  }
}
