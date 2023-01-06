export const wmoToOpenWeatherIcon: WmoToDescriptionMap = {
  0: '01', // clear sky
  1: '02', // mainly clear
  2: '03', // partly cloudy
  3: '04', // overcast
  45: '50', // fog
  58: '50', // depositing rime fog
  51: '09', // light drizzle
  53: '09', // moderate drizzle
  55: '09', // dense drizzle
  56: '09', // light freezing drizzle
  57: '09', // dense freezing drizzle
  61: '10', // slight rain
  63: '10', // moderate rain
  65: '10', // heavy rain
  66: '13', // light freezing rain
  67: '13', // heavy freezing rain
  71: '13', // slight snow
  73: '13', // moderate snow
  75: '13', // heavy snow
  77: '13', // snow grains
  80: '09', // slight rain showers
  81: '09', // moderate rain showers
  82: '09', // violent rain showers
  85: '13', // slight snow showers
  86: '13', // heavy snow showers
  95: '11', // thunderstorm
  96: '11', // thunderstorm with slight hail
  99: '11', // thunderstorm with heavy hail
}

export interface WmoToDescriptionMap {
  [key: number]: string
}

export const wmoToDescription: WmoToDescriptionMap = {
  0: 'Clear Sky',
  1: 'Mainly Clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  58: 'Depositing Rime Fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light Freezing Drizzle',
  57: 'Dense Freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate Rain',
  65: 'Heavy rain',
  66: 'Light Freezing Rain',
  67: 'Heavy Freezing Rain',
  71: 'Slight Snow',
  73: 'Moderate Snow',
  75: 'Heavy snow',
  77: 'Snow Grains',
  80: 'Slight Rain Showers',
  81: 'Moderate Rain Showers',
  82: 'Heavy Rain Showers',
  85: 'Slight Snow Showers',
  86: 'Heavy Snow Showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with Slight Hail',
  99: 'Thunderstorm with Heavy Hail',
}
