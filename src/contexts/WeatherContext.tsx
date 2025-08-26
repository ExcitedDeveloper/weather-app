import { createContext, ReactNode, useMemo } from 'react'
import { useWeather, WeatherDetails } from '../hooks/useWeather'
import { useLocation } from '../hooks/useLocation'

interface WeatherContextValue extends WeatherDetails {
  loading: boolean
  error: string | null
  refetch: () => void
}

export const WeatherContext = createContext<WeatherContextValue | undefined>(
  undefined
)

export const WeatherProvider = ({ children }: WeatherProviderProps) => {
  const { currLocation } = useLocation()
  const { weatherDetails, loading, error, refetch } = useWeather(currLocation)

  const value = useMemo<WeatherContextValue>(
    () => ({
      currentWeather: weatherDetails?.currentWeather,
      dailyWeather: weatherDetails?.dailyWeather || [],
      loading,
      error,
      refetch,
    }),
    [weatherDetails, loading, error, refetch]
  )

  return (
    <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
  )
}

export interface WeatherProviderProps {
  children: ReactNode
}
