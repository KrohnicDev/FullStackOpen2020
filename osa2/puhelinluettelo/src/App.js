import React, { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import PersonList from './components/PersonList'
import Filter from './components/Filter'
import personService from './service/PersonService'
import Notification from './components/Notification'

const notificationTypes = {
  error: "error",
  info: "info"
}

const App = () => {

  const [persons, setPersons] = useState([])
  const [notification, setNotification] = useState({})

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

  const handleSubmitClick = event => {
    event.preventDefault()
    const existingPerson = persons.find(person => person.name === newName)
    const newPerson = {
      name: newName,
      number: newNumber
    }

    if (existingPerson) {
      const updateConfirmed = window.confirm(`${newName} already exists in the phonebook. Do you want replace their number with a new one?`)

      if (updateConfirmed) {
        personService
          .update({ ...existingPerson, number: newNumber })
          .then(() => showNotification(
            `Updated ${newName}`, notificationTypes.info))
          .catch(() => showNotification(
            `Couldn't update ${newName}. Contact was already removed from the server`, notificationTypes.error))
          .finally(refreshPersons)
      }

    } else {
      personService
        .create(newPerson)
        .then(() => showNotification(
          `Added a new contact: ${newPerson.name}`, notificationTypes.info))
        .catch(() => showNotification(
          'Operation failed'))
        .finally(refreshPersons)
    }

    setNewName('')
    setNewNumber('')
  }

  const refreshPersons = () => {
    personService
      .getAll()
      .then(persons => {
        setPersons(persons)
      })
  }

  const deletePerson = (person) => {
    personService
      .deleteOne(person.id)
      .then(() => showNotification(
        `${person.name} deleted`, notificationTypes.info))
      .catch(() => showNotification(
        'Person not found', notificationTypes.error))
      .finally(refreshPersons)
  }

  const filtering = filterText.length > 1

  const filteredPersons = filtering
    ? persons.filter(person =>
      person.name
        .toLowerCase()
        .includes(filterText.toLowerCase()))
    : persons

  const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({})
    }, 5000)
  }

  useEffect(refreshPersons, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
      <Filter
        filterText={filterText}
        handleFilterTextChange={handleFilterTextChange} />
      <h2>Add new</h2>
      <PersonForm
        addPerson={handleSubmitClick}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers {filtering ? ' (filtered)' : ''}</h2>
      <PersonList persons={filteredPersons} deletePerson={deletePerson} />
    </div>
  )
}

export default App