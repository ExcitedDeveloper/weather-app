import { useState } from 'react'
import { SingleValue } from 'react-select'
import { AsyncPaginate } from 'react-select-async-paginate'
import { useGeoSearch, SearchOption } from '../../hooks/useGeoSearch'
import { useLocation } from '../../hooks/useLocation'

const Search = () => {
  const [selectedValue, setSelectedValue] =
    useState<SingleValue<SearchOption>>(null)
  const { searchCities, parseLocationValue, isLoading, error } = useGeoSearch()
  const { setCurrLocation } = useLocation()

  const loadOptions = async (inputValue: string) => {
    try {
      const options = await searchCities(inputValue)
      return { options }
    } catch (err) {
      return { options: [] }
    }
  }

  const handleOnChange = (data: SingleValue<SearchOption>) => {
    setSelectedValue(data)

    if (data) {
      const { latitude, longitude } = parseLocationValue(data.value)
      setCurrLocation({
        label: data.label,
        latitude,
        longitude,
      })
    }
  }

  const handleInputChange = (inputValue: string) => {
    if (selectedValue && inputValue === '') {
      setSelectedValue(null)
    }
    return inputValue
  }

  const handleMenuOpen = () => {
    if (selectedValue) {
      setSelectedValue(null)
    }
  }

  return (
    <div className="w-96">
      <AsyncPaginate
        placeholder="Search for city (e.g., 'New York' or 'London')"
        debounceTimeout={600}
        value={selectedValue}
        onChange={handleOnChange}
        onInputChange={handleInputChange}
        onMenuOpen={handleMenuOpen}
        loadOptions={loadOptions}
        isLoading={isLoading}
        isClearable={true}
        className="w-full"
        noOptionsMessage={({ inputValue }) => 
          inputValue ? `No cities found for "${inputValue}"` : 'Type to search cities'
        }
        loadingMessage={() => 'Searching cities...'}
      />
      {error && (
        <div className="mt-2 text-sm text-red-600" role="alert">
          ❌ {error}
        </div>
      )}
      {isLoading && (
        <div className="mt-2 text-sm text-blue-600">
          🔍 Searching...
        </div>
      )}
    </div>
  )
}

export default Search
