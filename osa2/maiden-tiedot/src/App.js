import React, { useState, useEffect } from 'react';
import axios from 'axios'
import Country from './components/Country'

const App = () => {

  const [searchString, setSearchString] = useState('')
  const [countries, setCountries] = useState([])
  const handleSearchStringChange = (event) => {
    setSelectedCountry(null)
    const newValue = event.target.value
    setSearchString(newValue)
  }

  useEffect(() => {
    const endpoint = 'https://restcountries.eu/rest/v2/all'
    axios
      .get(endpoint)
      .then(resp => {
        setCountries(resp.data)
      })
  }, [])

  const searching = searchString.length > 0

  const filteredCountries = !searching ? countries
    : countries.filter(country => {
      const key = searchString.toLowerCase()
      const names = [country.name, country.nativeName]
      return names.filter(name => name.toLowerCase().includes(key)).length > 0
    })

  const numberOfCountries = filteredCountries.length
  const maxResults = 10
  let notificationText = null

  if (!searching) {
    notificationText = 'Please enter a keyword'
  } else if (countries.length === 0) {
    notificationText = 'Unable to connect to the database'
  } else if (numberOfCountries > maxResults) {
    notificationText = 'Too many results'
  } else if (numberOfCountries === 0) {
    notificationText = 'No countries match keyword' + searchString
  }

  let singleResult = null
  if (numberOfCountries > 0) {
    if (numberOfCountries === 1) {
      singleResult = filteredCountries[0]
    } else if (numberOfCountries < maxResults) {
      for (const country of filteredCountries) {
        const names = [country.name, searchString]
          .map(str => str.toLowerCase())
        if (names[0] === names[1]) {
          singleResult = country
          break
        }
      }
    }
  }

  const [selectedCountry, setSelectedCountry] = useState(singleResult)

  const handleCountryChange = (event) => {
    let index = event.target.value
    let country = filteredCountries[index]
    setSelectedCountry(country)
  }

  return (
    <div>
      <input
        value={searchString}
        onChange={handleSearchStringChange}
        placeholder='Find countries'
      />
      {notificationText &&
        <p>{notificationText}</p>
      }
      {!notificationText && !selectedCountry &&
        <ul>
          {filteredCountries.map((country, index) =>
            <li key={country.numericCode}>
              {country.name}
              <button
                onClick={handleCountryChange}
                value={index}
              >
                show
              </button>
            </li>)}
        </ul>
      }
      {selectedCountry &&
        <Country country={selectedCountry} />
      }
    </div>
  )
}

export default App
