import { useContext } from 'react'
import {
  LocationContext,
  LocationContextProps,
  Location,
} from '../contexts/LocationContext'

/**
 * Custom hook for location context with proper typing
 */
export const useLocation = (): LocationContextProps => {
  const context = useContext(LocationContext)

  if (!context.setCurrLocation) {
    throw new Error('useLocation must be used within a LocationProvider')
  }

  return context as LocationContextProps
}

/**
 * Hook that provides location utilities
 */
export const useLocationUtils = () => {
  const { currLocation, setCurrLocation } = useLocation()

  const setLocationFromCoords = (
    latitude: number,
    longitude: number,
    label?: string
  ) => {
    setCurrLocation({
      latitude,
      longitude,
      label: label || `${latitude}, ${longitude}`,
    })
  }

  const clearLocation = () => {
    setCurrLocation(undefined)
  }

  const hasValidLocation = (location: Location | undefined): boolean => {
    return !!(location?.latitude && location?.longitude)
  }

  return {
    currLocation,
    setCurrLocation,
    setLocationFromCoords,
    clearLocation,
    hasValidLocation,
  }
}
