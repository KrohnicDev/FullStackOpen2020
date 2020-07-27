import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Country = (props) => {

  const country = props.country
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    const root = 'http://api.weatherstack.com/current'
    const accessKey = process.env.REACT_APP_API_KEY
    const endpoint = root + '?access_key=' + accessKey + '&query=' + country.capital

    axios
      .get(endpoint)
      .then(resp => {
        const data = resp.data
        console.log(data)
        setWeather(data.current)
      })
  }, [])

  return (
    <div>
      <h2>{country.name}</h2>
      <img
        src={country.flag}
        height={100}
        alt={'Flag of ' + country.name}
      />
      <br />
      Capital: {country.capital}
      <br />
      Population: {country.population}
      <h3>Languages</h3>
      <ul>
        {country.languages.map(language =>
          <li key={language.name}>
            {language.name}
          </li>)}
      </ul>
      {weather &&
        <div>
          <h3>Weather in {country.capital}</h3>
          <b>temperature:</b> {weather.temperature} celsius
                    <br />
          {weather.weather_icons.map(icon =>
            <img
              src={icon}
              key={icon}
              alt='Weather icon'
            />)
          }
        </div>
      }
    </div>
  )
}

export default Country