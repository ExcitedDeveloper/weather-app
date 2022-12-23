import { useState } from 'react'
import { SingleValue } from 'react-select'
import { AsyncPaginate } from 'react-select-async-paginate'
import { GEO_API_URL, geoApiOptions } from './api'

export interface SearchProps {
  onSearchChange: (newValue: SingleValue<string>) => void
}

export const DFLT_COUNTRY_CODE = 'US'

export interface City {
  name: string
  latitude: string
  longitude: string
  regionCode: string
  countryCode: string
  country?: string
}

const getCountryName = (countryCode: string) => {
  const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })
  return regionNames.of(countryCode)
}

const Search = ({ onSearchChange }: SearchProps) => {
  const [search, setSearch] = useState<string | null>(null)

  const loadOptions = async (inputValue: string) => {
    const emptyOptions = { options: [] }

    if (!inputValue) {
      return emptyOptions
    }

    const [namePrefix, regionCode, tmpCountryCode] = inputValue
      .split(',')
      .map((part) => part.toLowerCase())
      .map((part) => part.trim())

    // If regionCode has been specified, default countryCode
    // to US if countryCode is not entered
    const countryCode = regionCode
      ? tmpCountryCode || DFLT_COUNTRY_CODE
      : undefined

    let url
    let results

    if (namePrefix && regionCode && countryCode) {
      url = `${GEO_API_URL}/countries/${countryCode}/regions/${regionCode}/cities?namePrefix=${namePrefix}`

      const response = await fetch(url, geoApiOptions)

      const json = await response.json()

      results = {
        options: json.data.map((city: City) => {
          return {
            value: `${city.latitude} ${city.longitude}`,
            label: `${city.name}, ${regionCode.toUpperCase()}, ${getCountryName(
              countryCode
            )}`,
          }
        }),
      }
    } else {
      url = `${GEO_API_URL}/cities?limit=10&namePrefix=${namePrefix}`

      const response = await fetch(url, geoApiOptions)

      const json = await response.json()

      results = {
        options: json.data
          .filter((city: City) => {
            return regionCode
              ? city.regionCode.toLowerCase() === regionCode
              : true
          })
          .filter((city: City) => {
            return countryCode
              ? city.countryCode.toLowerCase() === countryCode
              : true
          })
          .map((city: City) => {
            return {
              value: `${city.latitude} ${city.longitude}`,
              label: `${
                city.name
              }, ${city.regionCode.toUpperCase()}, ${getCountryName(
                city.countryCode
              )}`,
            }
          }),
      }
    }

    return results || emptyOptions
  }

  const handleOnChange = (searchData: SingleValue<string>): void => {
    setSearch(searchData)
    onSearchChange(searchData)
  }

  return (
    <AsyncPaginate
      placeholder="Search for city"
      debounceTimeout={600}
      value={search}
      onChange={handleOnChange}
      loadOptions={loadOptions}
    />
  )
}

export default Search
