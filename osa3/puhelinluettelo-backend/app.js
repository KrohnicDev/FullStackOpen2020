const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const personRouter = require('./controllers/personController')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info('Connecting to MongoDB')

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}

mongoose
  .connect(config.MONGODB_URI, mongoOptions)
  .then(() => logger.info('Succesfully connected to MongoDB'))
  .catch(err => logger.error('Error connecting to MongoDB', err.message))

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

// Info page
app.get('/info', (_req, res) => {
  require('./models/person')
    .find({})
    .then(persons => res.send(
      `<div> Phonebook has info for ${persons.length} people<br/>${Date()}</div>`))
})

app.use('/api/persons', personRouter)
app.use(middleware.unknownEndPoint)
app.use(middleware.errorHandler)

module.exports = app