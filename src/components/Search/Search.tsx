import { useState, useContext } from 'react'
import { SingleValue } from 'react-select'
import { AsyncPaginate } from 'react-select-async-paginate'
import { GEO_API_URL, geoApiOptions } from '../../apis/geoApi'
import { LocationContext } from '../../contexts/LocationContext'

export const DFLT_COUNTRY_CODE = 'US'

export interface City {
  name: string
  latitude: string
  longitude: string
  regionCode: string
  countryCode: string
  country?: string
}

export interface LocationValueOf {
  label: string
  value: string
}

const getCountryName = (countryCode: string) => {
  const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })
  return regionNames.of(countryCode)
}

const Search = () => {
  const [search, setSearch] = useState<string | null>(null)
  const { setCurrLocation } = useContext(LocationContext)

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

  const handleOnChange = (data: SingleValue<string>): void => {
    setSearch(data)

    const searchData = data as unknown as LocationValueOf

    const [latStr, lonStr] = searchData.value.split(' ')

    if (setCurrLocation) {
      setCurrLocation({
        label: searchData.label,
        latitude: Number(latStr || 0),
        longitude: Number(lonStr || 0),
      })
    }
  }

  return (
    <AsyncPaginate
      placeholder="Search for city"
      debounceTimeout={600}
      value={search}
      onChange={handleOnChange}
      loadOptions={loadOptions}
      className="w-full"
    />
  )
}

export default Search
