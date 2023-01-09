import { useContext } from 'react'
import { LocationContext } from '../../contexts/LocationContext'
import { WeatherContext } from '../../contexts/WeatherContext'
import { OPEN_WEATHER_ICON_URL } from '../../apis/weatherApis'
import './CurrentCard.css'

const CurrentCard = () => {
  const { currLocation } = useContext(LocationContext)
  const weatherDetails = useContext(WeatherContext)

  if (!weatherDetails) {
    return null
  }

  return (
    <div className="mt-5 flex h-60 w-96 flex-col rounded-lg bg-slate-500 px-3 py-5 font-sans font-bold text-white">
      <div className="flex flex-1 flex-row">
        <div className="flex-2">
          <div className="text-base">{currLocation?.label}</div>
          <div className="text-xs capitalize">
            {weatherDetails.currentWeather?.description}
          </div>
        </div>
        <div className="flex flex-1 justify-end">
          {weatherDetails.currentWeather && (
            <img
              src={`${OPEN_WEATHER_ICON_URL}${weatherDetails.currentWeather?.icon}.png`}
              className="w-30 -mt-4 h-20"
              alt="Current weather icon"
            />
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-row">
        <div className="flex-1 text-6xl">
          {weatherDetails.currentWeather?.temp}
        </div>

        <div className="grid flex-1 grid-cols-[2fr_1fr] grid-rows-3 text-xs">
          <div className="col-span-2">Details</div>
          <div>Wind</div>
          <div>{`${weatherDetails.currentWeather?.wind} mph`}</div>
          <div>Wind Direction</div>
          <div>{`${weatherDetails.currentWeather?.winddirection}`}</div>
        </div>
      </div>
    </div>
  )
}

export default CurrentCard
