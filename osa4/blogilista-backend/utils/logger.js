const { NODE_ENV } = require('./config')
const isTesting = (NODE_ENV === 'test')
const isProduction = (NODE_ENV === 'production')
const isDevelopment = (NODE_ENV === 'development')

const trace = (...params) => {
  if (isDevelopment) {
    console.log('[TRACE]   ', ...params)
  }
}

const debug = (...params) => {
  if (!isProduction) {
    console.log('[DEBUG]   ', ...params)
  }
}

const info = (...params) => {
  console.log('[INFO]   ', ...params)
}

const warn = (...params) => {
  console.error('[WARN]   ', ...params)
}

const error = (...params) => {
  console.error('[ERROR]   ', ...params)
}

module.exports = {
  trace, debug, info, warn, error
}