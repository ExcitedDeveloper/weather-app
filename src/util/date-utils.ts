/**
 * Date utility functions
 */

/**
 * Formats date to ISO string (YYYY-MM-DD)
 */
export const formatDateToISO = (date: Date): string => {
  return date.toISOString().substring(0, 10)
}

/**
 * Gets a future date by adding days to the current date
 */
export const getFutureDate = (daysToAdd: number): Date => {
  const futureDate = new Date()
  futureDate.setDate(futureDate.getDate() + daysToAdd)
  return futureDate
}

/**
 * Gets date range for weather forecast
 */
export const getForecastDateRange = (forecastDays = 8) => {
  const today = new Date()
  const startDate = formatDateToISO(today)
  const endDate = formatDateToISO(getFutureDate(forecastDays))

  return { startDate, endDate }
}
