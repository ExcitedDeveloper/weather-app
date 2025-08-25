import { describe, it, expect } from 'vitest'
import {
  getDayOrNight,
  getWeatherIcon,
  formatPrecipitation,
  degToCompass,
  getDayOfWeek,
  formatTemperature,
  formatWindSpeed,
  formatTime,
  getWeatherDescription,
} from '../weather-utils'
import { DayOrNight } from '../enums'
import { DAYS_OF_WEEK } from '../constants'

describe('weather-utils', () => {
  describe('getDayOrNight', () => {
    it('should return Day when time is between sunrise and sunset', () => {
      const result = getDayOrNight(
        '2023-01-01T12:00:00Z',
        '2023-01-01T06:00:00Z',
        '2023-01-01T18:00:00Z'
      )
      expect(result).toBe(DayOrNight.Day)
    })

    it('should return Night when time is before sunrise', () => {
      const result = getDayOrNight(
        '2023-01-01T05:00:00Z',
        '2023-01-01T06:00:00Z',
        '2023-01-01T18:00:00Z'
      )
      expect(result).toBe(DayOrNight.Night)
    })

    it('should return Night when time is after sunset', () => {
      const result = getDayOrNight(
        '2023-01-01T19:00:00Z',
        '2023-01-01T06:00:00Z',
        '2023-01-01T18:00:00Z'
      )
      expect(result).toBe(DayOrNight.Night)
    })
  })

  describe('getWeatherIcon', () => {
    it('should return correct icon for day time', () => {
      const result = getWeatherIcon(
        0, // clear sky
        '2023-01-01T12:00:00Z',
        '2023-01-01T06:00:00Z',
        '2023-01-01T18:00:00Z'
      )
      expect(result).toBe('01d')
    })

    it('should return correct icon for night time', () => {
      const result = getWeatherIcon(
        0, // clear sky
        '2023-01-01T22:00:00Z',
        '2023-01-01T06:00:00Z',
        '2023-01-01T18:00:00Z'
      )
      expect(result).toBe('01n')
    })

    it('should use provided dayOrNight parameter', () => {
      const result = getWeatherIcon(
        0,
        '2023-01-01T12:00:00Z',
        '2023-01-01T06:00:00Z',
        '2023-01-01T18:00:00Z',
        DayOrNight.Night
      )
      expect(result).toBe('01n')
    })
  })

  describe('formatPrecipitation', () => {
    it('should return "trace" for values below minimum', () => {
      expect(formatPrecipitation(0.005)).toBe('trace')
    })

    it('should return formatted inches for values above minimum', () => {
      expect(formatPrecipitation(0.25)).toBe('0.25in')
    })

    it('should format to two decimal places', () => {
      expect(formatPrecipitation(1.234)).toBe('1.23in')
    })
  })

  describe('degToCompass', () => {
    it('should return N for 0 degrees', () => {
      expect(degToCompass(0)).toBe('N')
    })

    it('should return E for 90 degrees', () => {
      expect(degToCompass(90)).toBe('E')
    })

    it('should return S for 180 degrees', () => {
      expect(degToCompass(180)).toBe('S')
    })

    it('should return W for 270 degrees', () => {
      expect(degToCompass(270)).toBe('W')
    })

    it('should handle wrap around for 360 degrees', () => {
      expect(degToCompass(360)).toBe('N')
    })

    it('should return NE for 45 degrees', () => {
      expect(degToCompass(45)).toBe('NE')
    })
  })

  describe('getDayOfWeek', () => {
    it('should return correct day of week', () => {
      // Test with actual known days
      const testDate = new Date('2022-12-25')
      const expectedDay = DAYS_OF_WEEK[testDate.getDay()]
      expect(getDayOfWeek('2022-12-25')).toBe(expectedDay)

      const testDate2 = new Date('2022-12-26')
      const expectedDay2 = DAYS_OF_WEEK[testDate2.getDay()]
      expect(getDayOfWeek('2022-12-26')).toBe(expectedDay2)
    })
  })

  describe('formatTemperature', () => {
    it('should round temperature and add Fahrenheit symbol', () => {
      expect(formatTemperature(32.7)).toBe('33°F')
      expect(formatTemperature(32.2)).toBe('32°F')
      expect(formatTemperature(-5.8)).toBe('-6°F')
    })
  })

  describe('formatWindSpeed', () => {
    it('should round wind speed to nearest integer', () => {
      expect(formatWindSpeed(15.7)).toBe('16')
      expect(formatWindSpeed(15.2)).toBe('15')
    })
  })

  describe('formatTime', () => {
    it('should format date string to locale time', () => {
      const result = formatTime('2023-01-01T12:30:00Z')
      // Result will depend on system locale, but should be a valid time string
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('getWeatherDescription', () => {
    it('should return correct description for known weather codes', () => {
      expect(getWeatherDescription(0)).toBe('Clear Sky')
      expect(getWeatherDescription(95)).toBe('Thunderstorm')
    })

    it('should return "Unknown" for unknown weather codes', () => {
      expect(getWeatherDescription(999)).toBe('Unknown')
    })
  })
})
