import { useState, useEffect, useContext } from 'react'
import { LocationContext } from '../../contexts/LocationContext'
import { OPEN_WEATHER_DAILY_API_URL } from '../../apis/openWeatherApi'
import './DailyCard.css'

const DailyCard = () => {
  const { currLocation } = useContext(LocationContext)

  useEffect(() => {
    const fetchDaily = async () => {
      if (!currLocation) return

      const url = `${OPEN_WEATHER_DAILY_API_URL}?lat=${
        currLocation.latitude
      }&lon=${currLocation.longitude}&appid=${
        import.meta.env.VITE_OPEN_WEATHER_API_KEY
      }`

      const response = await fetch(url)

      const json = await response.json()

      console.log(`******** daily json`, json)
    }

    fetchDaily()
  }, [currLocation])

  return <div className="w-60 h-60 daily-card-container">DailyCard</div>
}

export default DailyCard
