import './App.css'
import UilReact from '@iconscout/react-unicons/icons/uil-react'
import Search from './components/Search/Search'

function App() {
  const handleOnSearchChange = (searchData: unknown) => {
    console.log(`************ searchData`, searchData)
  }

  return (
    <div className="mx-auto max-w-screen-md mt-5 py-5 px-32 bg-gradient-to-br from-cyan-700 to-blue-700 h-fit shadow-xl shadow-gray-400">
      <Search onSearchChange={handleOnSearchChange} />
    </div>
  )
}

export default App
