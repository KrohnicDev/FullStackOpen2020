const router = require('express').Router()
const logger = require('../utils/logger')
const PersonModel = require('../models/person')

const handleGetAllPersons = async (_req, res, next) => {
  try {
    const allPersons = await PersonModel.find({})
    res.json(allPersons)
  } catch (err) {
    next(err)
  }
}

const handleGetOnePerson = async (req, res, next) => {
  const id = req.params.id

  try {
    const person = await PersonModel.findById(id)

    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }

  } catch (err) {
    next(err)
  }
}

const handleCreatePerson = (req, res, next) => {
  const body = req.body
  const name = body.name
  const number = body.number

  if (!name || !number) {
    return res.status(400).send({ error: 'Person must have a name and a number.' })
  }

  const id = body.id
  const person = new PersonModel({ name, number })
  let promise = null

  if (id) {
    // update an existing person
    person._id = id
    promise = PersonModel.findByIdAndUpdate(id, person)
  } else {
    // create a new person
    promise = person.save()
  }

  promise
    .then(savedPerson => res.status(201).json(savedPerson))
    .catch(next)
}

const handleDeleteOnePerson = async (req, res, next) => {
  const id = req.params.id

  try {
    const deletedPerson = await PersonModel.findByIdAndRemove(id)

    if (deletedPerson) {
      logger.info(`Deleted contact ${deletedPerson.name}`)
      res.status(200).send()
    } else {
      logger.info(`Couldn't delete person (id: ${id})because it doesn't exist`)
    }

  } catch (err) {
    logger.error(`Failed to delete person with id ${id}`, err)
    next(err)
  }
}

const endpoints = {
  ALL_PERSONS: '/',
  SINGLE_PERSON: ':id',
}

router.get(endpoints.ALL_PERSONS, handleGetAllPersons)
router.get(endpoints.SINGLE_PERSON, handleGetOnePerson)
router.post(endpoints.ALL_PERSONS, handleCreatePerson)
router.put(endpoints.SINGLE_PERSON, handleCreatePerson)
router.delete(endpoints.SINGLE_PERSON, handleDeleteOnePerson)

module.exports = router