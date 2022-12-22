import { useState } from 'react'
import { SingleValue } from 'react-select'
import { AsyncPaginate, LoadOptions } from 'react-select-async-paginate'
import { GEO_API_URL, geoApiOptions } from './api'

export interface SearchProps {
  onSearchChange: (newValue: SingleValue<string>) => void
}

export const DFLT_COUNTRY_CODE = 'US'

const Search = ({ onSearchChange }: SearchProps) => {
  const [search, setSearch] = useState<string | null>(null)

  const loadOptions: LoadOptions<unknown, any, unknown> = (
    inputValue: string
  ): any => {
    const emptyOptions = { options: [] }

    if (!inputValue) return emptyOptions

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

      results = fetch(url, geoApiOptions)
        .then((response) => response.json())
        .then((response) => {
          return {
            options: response.data.map((city: any) => {
              return {
                value: `${city.latitude} ${city.longitude}`,
                label: `${city.name}, ${regionCode}, ${countryCode}`,
              }
            }),
          }
        })
        // eslint-disable-next-line no-console
        .catch((err) => console.error(err))
    } else {
      url = `${GEO_API_URL}/cities?limit=10&namePrefix=${namePrefix}`

      results = fetch(url, geoApiOptions)
        .then((response) => response.json())
        .then((response) => {
          return {
            options: response.data
              .filter((city: any) => {
                return regionCode
                  ? city.regionCode.toLowerCase() === regionCode
                  : true
              })
              .filter((city: any) => {
                return countryCode
                  ? city.countryCode.toLowerCase() === countryCode
                  : true
              })
              .map((city: any) => {
                return {
                  value: `${city.latitude} ${city.longitude}`,
                  label: `${city.name}, ${city.regionCode}, ${city.countryCode}`,
                }
              }),
          }
        })
        // eslint-disable-next-line no-console
        .catch((err) => console.error(err))
    }

    return results || emptyOptions
  }

  const handleOnChange = (searchData: any): void => {
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
