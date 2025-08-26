import { useState } from 'react'
import { GEO_API_URL, geoApiOptions } from '../apis/geoApi'
import { fetchWithErrorHandling, buildUrlWithParams } from '../util/api-utils'

export interface City {
  name?: string
  latitude?: string
  longitude?: string
  regionCode?: string
  region?: string // Some APIs use 'region' instead of 'regionCode'
  countryCode?: string
  country?: string
}

export interface SearchOption {
  label: string
  value: string
}

export const DFLT_COUNTRY_CODE = 'US'

/**
 * Hook for geographic search functionality
 */
export const useGeoSearch = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getCountryName = (countryCode: string): string => {
    try {
      const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })
      return regionNames.of(countryCode) || countryCode
    } catch {
      return countryCode
    }
  }

  const formatCityOption = (city: City): SearchOption => {
    // Handle missing or undefined properties safely
    const regionCode = city.regionCode || city.region || ''
    const countryCode = city.countryCode || 'US'
    const name = city.name || 'Unknown City'
    const latitude = city.latitude || '0'
    const longitude = city.longitude || '0'

    return {
      value: `${latitude} ${longitude}`,
      label: `${name}${
        regionCode ? `, ${regionCode.toUpperCase()}` : ''
      }, ${getCountryName(countryCode)}`,
    }
  }

  const searchCitiesWithRegion = async (
    namePrefix: string,
    regionCode: string,
    countryCode: string
  ): Promise<SearchOption[]> => {
    const url = `${GEO_API_URL}/countries/${countryCode}/regions/${regionCode}/places`
    const data = await fetchWithErrorHandling<{ data: City[] }>(
      buildUrlWithParams(url, { namePrefix }),
      geoApiOptions
    )

    if (!data.data || !Array.isArray(data.data)) {
      return []
    }

    return data.data.map(formatCityOption)
  }

  const searchCitiesGlobal = async (
    namePrefix: string,
    regionCode?: string,
    countryCode?: string
  ): Promise<SearchOption[]> => {
    const url = buildUrlWithParams(`${GEO_API_URL}/cities`, {
      limit: 10,
      namePrefix,
    })

    const data = await fetchWithErrorHandling<{ data: City[] }>(
      url,
      geoApiOptions
    )

    if (!data.data || !Array.isArray(data.data)) {
      return []
    }

    return data.data
      .filter((city) => {
        const cityRegion = (city.regionCode || city.region || '').toLowerCase()
        return !regionCode || cityRegion === regionCode
      })
      .filter((city) => {
        const cityCountry = (city.countryCode || '').toLowerCase()
        return !countryCode || cityCountry === countryCode
      })
      .map(formatCityOption)
  }

  const parseSearchInput = (input: string) => {
    const parts = input.split(',').map((part) => part.trim())

    // Only consider it a region code if there are at least 2 parts and the region is at least 2 characters
    const namePrefix = parts[0]?.toLowerCase() || ''
    const regionCode =
      parts.length >= 2 && parts[1] && parts[1].length >= 2
        ? parts[1].toLowerCase()
        : ''

    let countryCode = ''
    if (parts.length >= 3 && parts[2]) {
      countryCode = parts[2].toLowerCase()
    } else if (regionCode) {
      countryCode = DFLT_COUNTRY_CODE
    }

    return { namePrefix, regionCode, countryCode }
  }

  const searchCities = async (inputValue: string): Promise<SearchOption[]> => {
    if (!inputValue.trim()) {
      return []
    }

    // Check if API key is available
    if (!import.meta.env.VITE_RAPIDAPI_KEY) {
      const errorMessage =
        'Missing VITE_RAPIDAPI_KEY environment variable. Please check your .env file.'
      setError(errorMessage)
      return []
    }

    setIsLoading(true)
    setError(null)

    try {
      const { namePrefix, regionCode, countryCode } =
        parseSearchInput(inputValue)

      const results =
        namePrefix && regionCode && countryCode
          ? await searchCitiesWithRegion(namePrefix, regionCode, countryCode)
          : await searchCitiesGlobal(namePrefix, regionCode, countryCode)

      setError(null)
      return results
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed'
      setError(errorMessage)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const parseLocationValue = (value: string) => {
    const [latStr, lonStr] = value.split(' ')
    return {
      latitude: Number(latStr) || 0,
      longitude: Number(lonStr) || 0,
    }
  }

  return {
    searchCities,
    parseLocationValue,
    isLoading,
    error,
  }
}
