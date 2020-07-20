import React, { useState } from 'react'
import PersonForm from './components/PersonForm'
import PersonList from './components/PersonList'
import Filter from './components/Filter'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])

  const handleChange = (event, callback) => {
    const value = event.target.value
    callback(value)
  }

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterText, setFilterText] = useState('')

  const handleNameChange = event => handleChange(event, setNewName)
  const handleNumberChange = event => handleChange(event, setNewNumber)
  const handleFilterTextChange = event => handleChange(event, setFilterText)

  const filterIsOn = filterText.length > 0

  const addPerson = (event) => {
    event.preventDefault()
    const nameAlreadyPresent = persons.find(person => person.name === newName)

    if (nameAlreadyPresent) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const newPerson = { name: newName, number: newNumber }
    setPersons(persons.concat(newPerson))
    setNewName('')
    setNewNumber('')
  }

  const filteredPersons = filterIsOn
    ? persons.filter(person => person.name.toLowerCase().includes(filterText.toLowerCase()))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterText={filterText} handleFilterTextChange={handleFilterTextChange}/>
      <h2>Add new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers {filterIsOn ? ' (filtered)' : ''}</h2>
      <PersonList persons={filteredPersons}/>
    </div>
  )
}

export default App