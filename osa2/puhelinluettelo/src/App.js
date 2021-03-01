import React, { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import PersonList from './components/PersonList'
import Filter from './components/Filter'
import personService from './service/PersonService'
import Notification from './components/Notification'

const notificationTypes = {
  ERROR: "error",
  INFO: "info"
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
      const hasConfirmedUpdate = window.confirm(`${newName} already exists in the phonebook. Do you want replace their number with a new one?`)

      if (hasConfirmedUpdate) {
        personService
          .update({ ...existingPerson, number: newNumber })
          .then(() => showNotification(
            `Updated ${newName}`, notificationTypes.INFO))
          .catch(err => {
            console.log(err.response)
            const response = err.response
            const message = response ? response.data.error : err.message
            showNotification(
              `Couldn't update ${newName}. ${message}`, notificationTypes.ERROR)
          })
          .finally(refreshPersons)
      }

    } else {
      personService
        .create(newPerson)
        .then(() => showNotification(
          `Added a new contact: ${newPerson.name}`, notificationTypes.INFO))
        .catch(err => {
          const response = err.response
          const message = response ? response.data.error : err.message
          showNotification(message, notificationTypes.ERROR)
        })
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
      .catch(err => showNotification(
        `Couldn't fetch persons from the server.`, notificationTypes.ERROR
      ))
  }

  const deletePerson = (person) => {
    personService
      .deleteOne(person.id)
      .then(() => showNotification(
        `${person.name} deleted`, notificationTypes.INFO))
      .catch(() => showNotification(
        'Person not found', notificationTypes.ERROR))
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