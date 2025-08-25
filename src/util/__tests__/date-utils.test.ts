import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  formatDateToISO,
  getFutureDate,
  getForecastDateRange,
} from '../date-utils'

describe('date-utils', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  describe('formatDateToISO', () => {
    it('should format date to ISO string (YYYY-MM-DD)', () => {
      const date = new Date('2023-01-15T12:30:00Z')
      expect(formatDateToISO(date)).toBe('2023-01-15')
    })
  })

  describe('getFutureDate', () => {
    it('should return date with added days', () => {
      const baseDate = new Date('2023-01-01T00:00:00Z')
      vi.setSystemTime(baseDate)

      const futureDate = getFutureDate(7)
      expect(futureDate.toDateString()).toBe(
        new Date('2023-01-08T00:00:00Z').toDateString()
      )
    })

    it('should handle month rollover', () => {
      const baseDate = new Date('2023-01-28T00:00:00Z')
      vi.setSystemTime(baseDate)

      const futureDate = getFutureDate(7)
      expect(futureDate.toDateString()).toBe(
        new Date('2023-02-04T00:00:00Z').toDateString()
      )
    })
  })

  describe('getForecastDateRange', () => {
    it('should return correct date range with default 8 days', () => {
      const baseDate = new Date('2023-01-01')
      vi.setSystemTime(baseDate)

      const result = getForecastDateRange()
      expect(result.startDate).toBe('2023-01-01')
      expect(result.endDate).toBe('2023-01-09')
    })

    it('should return correct date range with custom days', () => {
      const baseDate = new Date('2023-01-01')
      vi.setSystemTime(baseDate)

      const result = getForecastDateRange(5)
      expect(result.startDate).toBe('2023-01-01')
      expect(result.endDate).toBe('2023-01-06')
    })
  })
})
