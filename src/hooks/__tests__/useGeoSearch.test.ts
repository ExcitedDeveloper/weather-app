import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useGeoSearch } from '../useGeoSearch'

// Mock the API utils
vi.mock('../../util/api-utils', () => ({
  fetchWithErrorHandling: vi.fn(),
  buildUrlWithParams: vi.fn(
    (base: string, params: Record<string, string | number>) => {
      const url = new URL(base)
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value.toString())
      })
      return url.toString()
    }
  ),
}))

const mockFetchWithErrorHandling = vi.mocked(
  (await import('../../util/api-utils')).fetchWithErrorHandling
)

describe('useGeoSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('searchCities', () => {
    it('should return empty array for empty input', async () => {
      const { result } = renderHook(() => useGeoSearch())

      const cities = await result.current.searchCities('')
      expect(cities).toEqual([])
    })

    it('should search cities and format results', async () => {
      const mockCityData = {
        data: [
          {
            name: 'New York',
            latitude: '40.7128',
            longitude: '-74.0060',
            regionCode: 'NY',
            countryCode: 'US',
          },
        ],
      }

      mockFetchWithErrorHandling.mockResolvedValueOnce(mockCityData)

      const { result } = renderHook(() => useGeoSearch())

      const cities = await result.current.searchCities('New York')

      expect(cities).toHaveLength(1)
      expect(cities[0]).toEqual({
        label: 'New York, NY, United States',
        value: '40.7128 -74.0060',
      })
    })

    it('should handle search with region and country code', async () => {
      const mockCityData = {
        data: [
          {
            name: 'Paris',
            latitude: '48.8566',
            longitude: '2.3522',
            regionCode: 'IDF',
            countryCode: 'FR',
          },
        ],
      }

      mockFetchWithErrorHandling.mockResolvedValueOnce(mockCityData)

      const { result } = renderHook(() => useGeoSearch())

      const cities = await result.current.searchCities('Paris, IDF, FR')

      expect(cities).toHaveLength(1)
      expect(cities[0]).toEqual({
        label: 'Paris, IDF, France',
        value: '48.8566 2.3522',
      })
    })

    it('should set error state on API failure', async () => {
      const mockError = new Error('API Error')
      mockFetchWithErrorHandling.mockRejectedValueOnce(mockError)

      const { result } = renderHook(() => useGeoSearch())

      const cities = await result.current.searchCities('test')

      expect(cities).toEqual([])
      await waitFor(() => {
        expect(result.current.error).toBe('API Error')
      })
    })

    it('should set loading state during search', async () => {
      let resolvePromise: (value: any) => void
      const mockPromise = new Promise((resolve) => {
        resolvePromise = resolve
      })

      mockFetchWithErrorHandling.mockReturnValueOnce(mockPromise)

      const { result } = renderHook(() => useGeoSearch())

      const searchPromise = result.current.searchCities('test')

      // Should be loading
      await waitFor(() => {
        expect(result.current.isLoading).toBe(true)
      })

      // Resolve the mock promise
      resolvePromise!({ data: [] })
      await searchPromise

      // Should no longer be loading
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
    })
  })

  describe('parseLocationValue', () => {
    it('should parse location value correctly', () => {
      const { result } = renderHook(() => useGeoSearch())

      const parsed = result.current.parseLocationValue('40.7128 -74.0060')

      expect(parsed).toEqual({
        latitude: 40.7128,
        longitude: -74.006,
      })
    })

    it('should handle invalid values gracefully', () => {
      const { result } = renderHook(() => useGeoSearch())

      const parsed = result.current.parseLocationValue('invalid')

      expect(parsed).toEqual({
        latitude: 0,
        longitude: 0,
      })
    })
  })
})
