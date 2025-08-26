import React from 'react'
import ReactDOM from 'react-dom/client'
import { LocationProvider } from './contexts/LocationContext'
import { WeatherProvider } from './contexts/WeatherContext'
import { ThemeProvider } from './contexts/ThemeContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <LocationProvider>
        <WeatherProvider>
          <App />
        </WeatherProvider>
      </LocationProvider>
    </ThemeProvider>
  </React.StrictMode>
)
