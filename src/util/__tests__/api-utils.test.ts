import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchWithErrorHandling, buildUrlWithParams } from '../api-utils'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('api-utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  describe('fetchWithErrorHandling', () => {
    it('should return parsed JSON on successful request', async () => {
      const mockData = { test: 'data' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce(mockData),
      })

      const result = await fetchWithErrorHandling('https://test.com')
      expect(result).toEqual(mockData)
      expect(mockFetch).toHaveBeenCalledWith('https://test.com', undefined)
    })

    it('should throw error on HTTP error status', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      await expect(fetchWithErrorHandling('https://test.com')).rejects.toThrow(
        'HTTP error! status: 404'
      )
    })

    it('should throw and log error on network failure', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {})
      const networkError = new Error('Network error')
      mockFetch.mockRejectedValueOnce(networkError)

      await expect(fetchWithErrorHandling('https://test.com')).rejects.toThrow(
        'Network error'
      )
      expect(consoleErrorSpy).toHaveBeenCalledWith('Fetch error:', networkError)

      consoleErrorSpy.mockRestore()
    })

    it('should pass options to fetch', async () => {
      const mockData = { test: 'data' }
      const options = { method: 'POST' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce(mockData),
      })

      await fetchWithErrorHandling('https://test.com', options)
      expect(mockFetch).toHaveBeenCalledWith('https://test.com', options)
    })
  })

  describe('buildUrlWithParams', () => {
    it('should build URL with query parameters', () => {
      const result = buildUrlWithParams('https://api.example.com', {
        param1: 'value1',
        param2: 123,
      })

      expect(result).toBe('https://api.example.com/?param1=value1&param2=123')
    })

    it('should handle empty parameters', () => {
      const result = buildUrlWithParams('https://api.example.com', {})
      expect(result).toBe('https://api.example.com/')
    })

    it('should handle special characters in parameters', () => {
      const result = buildUrlWithParams('https://api.example.com', {
        query: 'hello world',
        special: '&=+',
      })

      expect(result).toBe(
        'https://api.example.com/?query=hello+world&special=%26%3D%2B'
      )
    })
  })
})
