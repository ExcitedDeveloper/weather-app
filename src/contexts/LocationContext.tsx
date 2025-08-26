import { createContext, useState, ReactNode, useMemo, Dispatch } from 'react'

export interface Location {
  label?: string
  latitude?: number
  longitude?: number
}

export interface LocationContextProps {
  currLocation?: Location
  setCurrLocation: Dispatch<React.SetStateAction<Location | undefined>>
}

export interface LocationUtilsProps {
  currLocation?: Location
  setCurrLocation: Dispatch<React.SetStateAction<Location | undefined>>
  setLocationFromCoords: (
    latitude: number,
    longitude: number,
    label?: string
  ) => void
  clearLocation: () => void
  hasValidLocation: (location: Location | undefined) => boolean
}

export const LocationContext = createContext<Partial<LocationContextProps>>({})

export interface LocationProviderProps {
  children: ReactNode
}

export const LocationProvider = ({ children }: LocationProviderProps) => {
  const [currLocation, setCurrLocation] = useState<Location>()

  const value = useMemo(
    () => ({ currLocation, setCurrLocation }),
    [currLocation]
  )

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  )
}
