import { useEffect, useContext } from 'react'
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

  return (
    <div className="flex flex-col w-96 h-60 mt-5 px-3 py-5 rounded-lg bg-slate-700 font-sans font-bold text-base text-white">
      <div className="flex flex-row">
        <div>{currLocation?.label}</div>
        <div>;lakjdf</div>
      </div>
      <div>lka;dl</div>
    </div>
  )
}

export default DailyCard
