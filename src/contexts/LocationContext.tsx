import { createContext, useState, ReactNode, useMemo, Dispatch } from 'react'

export interface Location {
  latitude: number
  longitude: number
}

export interface LocationContextProps {
  currLocation: Location
  setCurrLocation: Dispatch<React.SetStateAction<Location>>
}

export const LocationContext = createContext<Partial<LocationContextProps>>({})

export interface LocationProviderProps {
  children: ReactNode
}

export const LocationProvider = ({ children }: LocationProviderProps) => {
  const [currLocation, setCurrLocation] = useState({
    latitude: 0,
    longitude: 0,
  })

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
