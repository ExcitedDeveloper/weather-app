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

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '16px',
      padding: '8px 12px',
      minHeight: '56px',
      boxShadow: state.isFocused
        ? '0 0 0 2px rgba(255, 255, 255, 0.3)'
        : '0 10px 25px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        transform: 'translateY(-1px)',
      },
    }),
    input: (provided: any) => ({
      ...provided,
      color: 'white',
      fontSize: '16px',
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: '16px',
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: 'white',
      fontSize: '16px',
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
      marginTop: '8px',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? 'rgba(59, 130, 246, 0.5)'
        : state.isFocused
        ? 'rgba(59, 130, 246, 0.1)'
        : 'transparent',
      color: state.isSelected ? 'white' : '#374151',
      fontSize: '15px',
      padding: '12px 16px',
      cursor: 'pointer',
    }),
    indicatorsContainer: (provided: any) => ({
      ...provided,
      '& > div': {
        color: 'rgba(255, 255, 255, 0.7)',
      },
    }),
  }

  return (
    <div className="w-full max-w-md">
      <AsyncPaginate
        placeholder="Search for city (e.g., 'New York' or 'London')"
        debounceTimeout={600}
        value={selectedValue}
        onChange={handleOnChange}
        onInputChange={handleInputChange}
        onMenuOpen={handleMenuOpen}
        loadOptions={loadOptions}
        isLoading={isLoading}
        isClearable
        styles={customStyles}
        className="w-full"
        noOptionsMessage={({ inputValue }) =>
          inputValue
            ? `No cities found for "${inputValue}"`
            : 'Type to search cities'
        }
        loadingMessage={() => 'Searching cities...'}
      />
      {error && (
        <div
          className="mt-3 rounded-lg border border-red-300/30 bg-red-500/20 p-3 backdrop-blur-lg"
          role="alert"
        >
          <div className="flex items-center text-white">
            <span className="mr-2 text-lg">⚠️</span>
            <span className="text-sm font-medium">{error}</span>
          </div>
        </div>
      )}
      {isLoading && (
        <div className="mt-3 rounded-lg border border-blue-300/30 bg-blue-500/20 p-3 backdrop-blur-lg">
          <div className="flex items-center text-white">
            <div className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            <span className="text-sm font-medium">Searching cities...</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Search
