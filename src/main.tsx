import React from 'react'
import ReactDOM from 'react-dom/client'
import { LocationProvider } from './contexts/LocationContext'
import { WeatherProvider } from './contexts/WeatherContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <LocationProvider>
      <WeatherProvider>
        <App />
      </WeatherProvider>
    </LocationProvider>
  </React.StrictMode>
)
