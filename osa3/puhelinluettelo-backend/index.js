const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

morgan.token('req-body', req => JSON.stringify(req.body))

const app = express()
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))
app.use(cors())



let persons = [
  { id: 1, name: 'Joonas Krohn', number: '0404150332' },
  { id: 2, name: 'Siiri Krohn', number: '123456789' },
  { id: 3, name: 'Aino Krohn', number: '00000000' }
]

const findPerson = (id) => persons.find(person => person.id == id)

const endpoints = {
  persons: '/api/persons',
  singlePerson: '/api/persons/:id',
  info: '/info'
}

// all persons
app.get(endpoints.persons, (req, res) => {
  res.json(persons)
})

// one person
app.get(endpoints.singlePerson, (req, res) => {
  const id = req.params.id
  const person = findPerson(id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).send('No such person found')
  }
})

// info page
app.get(endpoints.info, (req, res) => {
  res.send(`<div> Phonebook has info for ${persons.length} people<br/>${Date()}</div>`)
})

// create person
app.post(endpoints.persons, (req, res) => {
  let id = Math.random() * 1000000
  id = Math.floor(id)
  const newPerson = { ...req.body, id }
  console.log(newPerson)

  let error = null
  if (!newPerson.name || !newPerson.number) {
    error = 'Person must have a name and a number'
  } else if (persons.find(person => person.name == newPerson.name)) {
    error = 'Person already exists'
  }

  if (error) {
    res.status(400).send(error)
  } else {
    persons = persons.concat(newPerson)
    res.status(201).json(newPerson)
  }
})

// delete person
app.delete(endpoints.singlePerson, (req, res) => {
  const id = req.params.id
  const person = findPerson(id)

  if (person) {
    persons = persons.filter(person => person.id != id)
    res.json(persons)
  } else {
    res.status(404).send()
  }
})

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})