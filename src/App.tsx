import './App.css'
import Search from './components/Search/Search'
import CardList from './components/CardList/CardList'
import CurrentCard from './components/CurrentCard/CurrentCard'
import ThemeToggle from './components/ThemeToggle/ThemeToggle'
import { useTheme } from './hooks/useTheme'

function App() {
  const { theme } = useTheme()

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        theme === 'dark'
          ? 'to-indigo-950 bg-gradient-to-br from-slate-900 via-purple-900'
          : 'bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-200'
      }`}
    >
      <div
        className={`min-h-screen backdrop-blur-sm transition-all duration-500 ${
          theme === 'dark'
            ? 'bg-gradient-to-t from-black/30 via-black/10 to-black/5'
            : 'bg-gradient-to-t from-white/30 via-white/10 to-white/5'
        }`}
      >
        <div className="container mx-auto px-4 py-8">
          <header className="relative mx-auto mb-8 flex max-w-2xl flex-col items-center space-y-6 sm:max-w-full">
            <div className="absolute right-0 top-0">
              <ThemeToggle />
            </div>
            <div className="mx-auto text-center">
              <h1
                className={`mb-2 text-4xl font-bold drop-shadow-lg transition-colors duration-500 sm:text-3xl ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                Weather App
              </h1>
              <p
                className={`text-lg transition-colors duration-500 sm:text-base ${
                  theme === 'dark' ? 'text-white/80' : 'text-gray-700'
                }`}
              >
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
