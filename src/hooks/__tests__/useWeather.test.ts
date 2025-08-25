import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useWeather } from '../useWeather'
import type { Location } from '../../contexts/LocationContext'

// Mock the utility functions
vi.mock('../../util/weather-utils', () => ({
  getWeatherIcon: vi.fn(() => '01d'),
  formatTemperature: vi.fn((temp) => `${Math.round(temp)}°F`),
  formatWindSpeed: vi.fn((speed) => `${Math.round(speed)}`),
  degToCompass: vi.fn(() => 'N'),
  getWeatherDescription: vi.fn(() => 'Clear Sky'),
  getDayOfWeek: vi.fn(() => 'Monday'),
  formatPrecipitation: vi.fn(() => 'trace'),
  formatTime: vi.fn(() => '12:00:00 PM'),
}))

vi.mock('../../util/date-utils', () => ({
  getForecastDateRange: vi.fn(() => ({
    startDate: '2023-01-01',
    endDate: '2023-01-08',
  })),
}))

vi.mock('../../util/api-utils', () => ({
  fetchWithErrorHandling: vi.fn(),
  buildUrlWithParams: vi.fn(() => 'https://api.test.com'),
}))

const mockFetchWithErrorHandling = vi.mocked(
  await import('../../util/api-utils')
).fetchWithErrorHandling

describe('useWeather', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockLocation: Location = {
    latitude: 40.7128,
    longitude: -74.006,
    label: 'New York, NY',
  }

  const mockWeatherData = {
    current_weather: {
      temperature: 72,
      windspeed: 10,
      winddirection: 180,
      weathercode: 0,
      time: '2023-01-01T12:00:00Z',
    },
    daily: {
      apparent_temperature_max: [75, 76, 77],
      apparent_temperature_min: [60, 61, 62],
      precipitation_hours: [0, 1, 2],
      precipitation_sum: [0, 0.1, 0.2],
      rain_sum: [null, 0.1, 0.2],
      showers_sum: [null, null, null],
      snowfall_sum: [null, null, null],
      sunrise: [
        '2023-01-01T07:00:00Z',
        '2023-01-02T07:01:00Z',
        '2023-01-03T07:02:00Z',
      ],
      sunset: [
        '2023-01-01T17:00:00Z',
        '2023-01-02T17:01:00Z',
        '2023-01-03T17:02:00Z',
      ],
      temperature_2m_max: [75, 76, 77],
      temperature_2m_min: [60, 61, 62],
      time: ['2023-01-01', '2023-01-02', '2023-01-03'],
      weathercode: [0, 1, 2],
      winddirection_10m_dominant: [180, 190, 200],
      windgusts_10m_max: [15, 16, 17],
      windspeed_10m_max: [10, 11, 12],
    },
  }

  it('should not fetch data when location is undefined', () => {
    const { result } = renderHook(() => useWeather(undefined))

    expect(result.current.weatherDetails).toBeUndefined()
    expect(result.current.loading).toBe(false)
    expect(mockFetchWithErrorHandling).not.toHaveBeenCalled()
  })

  it('should not fetch data when location lacks coordinates', () => {
    const incompleteLocation = { label: 'Test' }
    const { result } = renderHook(() => useWeather(incompleteLocation))

    expect(result.current.weatherDetails).toBeUndefined()
    expect(result.current.loading).toBe(false)
    expect(mockFetchWithErrorHandling).not.toHaveBeenCalled()
  })

  it('should fetch and transform weather data successfully', async () => {
    mockFetchWithErrorHandling.mockResolvedValueOnce(mockWeatherData)

    const { result } = renderHook(() => useWeather(mockLocation))

    // Initially loading
    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.weatherDetails).toBeDefined()
    expect(result.current.weatherDetails?.currentWeather).toBeDefined()
    expect(result.current.weatherDetails?.dailyWeather).toHaveLength(1) // slice(2) means only 1 item
    expect(result.current.error).toBeNull()
  })

  it('should handle API errors', async () => {
    const mockError = new Error('API Error')
    mockFetchWithErrorHandling.mockRejectedValueOnce(mockError)

    const { result } = renderHook(() => useWeather(mockLocation))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('API Error')
    expect(result.current.weatherDetails).toBeUndefined()
  })

  it('should refetch data when location changes', async () => {
    mockFetchWithErrorHandling.mockResolvedValue(mockWeatherData)

    const { result, rerender } = renderHook(
      ({ location }) => useWeather(location),
      { initialProps: { location: mockLocation } }
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockFetchWithErrorHandling).toHaveBeenCalledTimes(1)

    const newLocation = { ...mockLocation, latitude: 41.8781 }
    rerender({ location: newLocation })

    await waitFor(() => {
      expect(mockFetchWithErrorHandling).toHaveBeenCalledTimes(2)
    })
  })

  it('should provide refetch functionality', async () => {
    mockFetchWithErrorHandling.mockResolvedValue(mockWeatherData)

    const { result } = renderHook(() => useWeather(mockLocation))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockFetchWithErrorHandling).toHaveBeenCalledTimes(1)

    await result.current.refetch()

    expect(mockFetchWithErrorHandling).toHaveBeenCalledTimes(2)
  })
})
