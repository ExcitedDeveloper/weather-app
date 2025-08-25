import { useLocation } from '../../hooks/useLocation'
import { useWeatherContext } from '../../hooks/useWeatherContext'
import { OPEN_WEATHER_ICON_URL } from '../../apis/weatherApis'
import './CurrentCard.css'

const CurrentCard = () => {
  const { currLocation } = useLocation()
  const { currentWeather, loading, error } = useWeatherContext()

  if (loading) {
    return (
      <div className="mt-5 flex h-60 w-96 items-center justify-center rounded-lg bg-slate-500 text-white">
        <div className="text-center">
          <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-white" />
          <div>Loading weather...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-5 flex h-60 w-96 items-center justify-center rounded-lg bg-red-500 text-white">
        <div className="text-center">
          <div className="text-sm">Error loading weather</div>
          <div className="text-xs opacity-75">{error}</div>
        </div>
      </div>
    )
  }

  if (!currentWeather || !currLocation) {
    return null
  }

  return (
    <div className="mt-5 flex h-60 w-96 flex-col rounded-lg bg-slate-500 px-3 py-5 font-sans font-bold text-white">
      <div className="flex flex-1 flex-row">
        <div className="flex-2">
          <div className="text-base">{currLocation.label}</div>
          <div className="text-xs capitalize">{currentWeather.description}</div>
        </div>
        <div className="flex flex-1 justify-end">
          <img
            src={`${OPEN_WEATHER_ICON_URL}${currentWeather.icon}.png`}
            className="w-30 -mt-4 h-20"
            alt={`${currentWeather.description} weather icon`}
          />
        </div>
      </div>
      <div className="flex flex-1 flex-row">
        <div className="flex-1 text-6xl">{currentWeather.temp}</div>

        <div className="grid flex-1 grid-cols-[2fr_1fr] grid-rows-3 text-xs">
          <div className="col-span-2">Details</div>
          <div>Wind</div>
          <div>{currentWeather.wind} mph</div>
          <div>Wind Direction</div>
          <div>{currentWeather.winddirection}</div>
        </div>
      </div>
    </div>
  )
}

export default CurrentCard
