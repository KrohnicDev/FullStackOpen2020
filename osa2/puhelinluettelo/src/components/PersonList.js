import React from 'react'

const PersonList = (props) => {

  const { persons, deletePerson } = props

  const handleDeleteClick = (event) => {
    const index = event.target.value
    const person = persons[index]
    const deletionConfirmed = window.confirm(`Delete contact ${person.name}?`)

    if (deletionConfirmed) {
      deletePerson(person)
    }
  }

  if (persons.length === 0) {
    return <p>No numbers found</p>
  }

  return persons.map((person, index) =>
    <div key={person.id}>
      <p>
        {person.name} {person.number}
        <button value={index} onClick={handleDeleteClick}>Delete</button>
      </p>
    </div>
  )
}

export default PersonList