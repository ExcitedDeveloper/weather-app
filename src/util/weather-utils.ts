import { wmoToDescription, wmoToOpenWeatherIcon } from './weather'
import { DAYS_OF_WEEK, MIN_PRECIP } from './constants'
import { DayOrNight } from './enums'

/**
 * Determines if it's day or night based on current time, sunrise, and sunset
 */
export const getDayOrNight = (
  time: string,
  sunriseStr: string,
  sunsetStr: string
): DayOrNight => {
  const currTime = new Date(time)
  const sunrise = new Date(sunriseStr)
  const sunset = new Date(sunsetStr)

  return currTime >= sunrise && currTime < sunset
    ? DayOrNight.Day
    : DayOrNight.Night
}

/**
 * Gets weather icon based on WMO code and time of day
 */
export const getWeatherIcon = (
  weathercode: number,
  time: string,
  sunrise: string,
  sunset: string,
  dayOrNight?: DayOrNight
): string => {
  const dayNight = dayOrNight || getDayOrNight(time, sunrise, sunset)
  return `${wmoToOpenWeatherIcon[weathercode]}${dayNight}`
}

/**
 * Formats precipitation amount
 */
export const formatPrecipitation = (amount: number): string => {
  return amount < MIN_PRECIP ? 'trace' : `${amount.toFixed(2)}in`
}

/**
 * Converts degrees to compass direction
 */
export const degToCompass = (degrees: number): string => {
  const val = Math.floor(degrees / 22.5 + 0.5)
  const directions = [
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
  return directions[val % 16]
}

/**
 * Gets day of week from date string
 */
export const getDayOfWeek = (dateString: string): string => {
  return DAYS_OF_WEEK[new Date(dateString).getDay()]
}

/**
 * Rounds temperature and adds Fahrenheit symbol
 */
export const formatTemperature = (temp: number): string => {
  return `${Math.round(temp)}\u00B0F`
}

/**
 * Formats wind speed
 */
export const formatWindSpeed = (speed: number): string => {
  return `${Math.round(speed)}`
}

/**
 * Formats time from date string to locale time
 */
export const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString()
}

/**
 * Gets weather description from WMO code
 */
export const getWeatherDescription = (weatherCode: number): string => {
  return wmoToDescription[weatherCode] || 'Unknown'
}
