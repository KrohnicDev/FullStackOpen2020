const express = require('express')
const app = express()
require('express-async-errors')
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const blogRouter = require('./routes/blogs')
const userRouter = require('./routes/users')
const loginRouter = require('./routes/login')
const middleware = require('./utils/middleware')

logger.info('Connecting to MongoDB')

const mongoDbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}

mongoose
  .connect(config.MONGODB_URI, mongoDbOptions)
  .then(() => logger.info('Successfully connected to MongoDB'))
  .catch(err => logger.error('Could not connect to MongoDB', err))

app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)
app.use(express.static('build'))
app.use('/api/login', loginRouter)
app.use('/api/users', userRouter)
app.use('/api/blogs', blogRouter)

if (config.isTestEnv()) {
  const testingRouter = require('./routes/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.errorHandler)

module.exports = app