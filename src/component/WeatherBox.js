import React from 'react'

export const WeatherBox = ({weather, localTime}) => {
  return (
    <div className='weather-box'>
        <div>{weather?.name}</div>
        <h2>
          <span style={{ color: 'blue' }}>{weather?.main.temp}°C</span>
          <span style={{ color: 'black' }}> / </span>
          <span style={{ color: 'red' }}>{(weather?.main.temp * 1.8 + 32).toFixed(0)}°F</span>
        </h2>
        <h3>{weather?.weather[0].description}</h3>
    </div>
  )
}
