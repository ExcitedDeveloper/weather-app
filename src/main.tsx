import React from 'react'
import ReactDOM from 'react-dom/client'
import { LocationProvider } from './contexts/LocationContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <LocationProvider>
      <App />
    </LocationProvider>
  </React.StrictMode>
)
