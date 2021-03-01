const logger = require('./logger')

const errorHandler = (err, _req, res, next) => {
  logger.error(err)
  const errorName = err.name

  if (errorName === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  if (errorName === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }

  if (errorName === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' })
  }

  logger.error(err.message)
  next(err)
}

const tokenExtractor = (request, response, next) => {
  const auth = request.get('authorization')

  if (auth && auth.toLowerCase().startsWith('bearer')) {
    request.token = auth.substring(7)
  }

  next()
}

module.exports = {
  errorHandler, tokenExtractor
}