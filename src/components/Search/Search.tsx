import { useState } from 'react'
import { SingleValue, ActionMeta } from 'react-select'
import { AsyncPaginate } from 'react-select-async-paginate'
import { GEO_API_URL, geoApiOptions } from './api'

export interface SearchProps {
  onSearchChange: (newValue: SingleValue<string>) => void
}

const Search = ({ onSearchChange }: SearchProps) => {
  const [search, setSearch] = useState<string | null>(null)

  const loadOptions = (inputValue: string) => {
    fetch(
      `${GEO_API_URL}/cities?limit=20&namePrefix=${inputValue}`,
      geoApiOptions
    )
      .then((response) => response.json())
      .then((response) => console.log(response))
      // eslint-disable-next-line no-console
      .catch((err) => console.error(err))
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
