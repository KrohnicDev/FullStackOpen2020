const logger = require('./logger')

const unknownEndPoint = (_req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (err, _req, res, next) => {
  logger.error(err)
  const errorName = err.name

  if (errorName === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  if (errorName === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }

  next(err)
}

const morgan = require('morgan')
morgan.token('req-body', req => JSON.stringify(req.body))

module.exports = {
  unknownEndPoint,
  errorHandler,
  morgan
}