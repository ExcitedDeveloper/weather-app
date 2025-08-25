import './App.css'
import Search from './components/Search/Search'
import CardList from './components/CardList/CardList'
import CurrentCard from './components/CurrentCard/CurrentCard'

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="mx-auto mt-5 flex w-1/4 min-w-fit flex-col items-center py-5">
        <Search />
        <CurrentCard />
      </header>
      <main className="flex-1">
        <CardList />
      </main>
    </div>
  )
}

export default App
