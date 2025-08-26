import './App.css'
import Search from './components/Search/Search'
import CardList from './components/CardList/CardList'
import CurrentCard from './components/CurrentCard/CurrentCard'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-950">
      <div className="min-h-screen bg-gradient-to-t from-black/30 via-black/10 to-black/5 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <header className="mx-auto mb-8 flex max-w-2xl flex-col items-center space-y-6 sm:max-w-full">
            <div className="text-center">
              <h1 className="mb-2 text-4xl font-bold text-white drop-shadow-lg sm:text-3xl">
                Weather App
              </h1>
              <p className="text-lg text-white/80 sm:text-base">
                Get accurate weather forecasts for any location
              </p>
            </div>
            <Search />
            <CurrentCard />
          </header>
          <main className="mx-auto max-w-6xl">
            <CardList />
          </main>
        </div>
      </div>
    </div>
  )
}

export default App
