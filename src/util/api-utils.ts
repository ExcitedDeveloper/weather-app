/**
 * API utility functions
 */

/**
 * Generic fetch wrapper with error handling
 */
export const fetchWithErrorHandling = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  try {
    const response = await fetch(url, options)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}

/**
 * Builds URL with query parameters
 */
export const buildUrlWithParams = (
  baseUrl: string,
  params: Record<string, string | number>
): string => {
  const url = new URL(baseUrl)
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value.toString())
  })
  return url.toString()
}
