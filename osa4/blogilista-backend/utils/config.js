require('dotenv').config()

const env = process.env
const NODE_ENV = env.NODE_ENV
const isTestEnv = () => NODE_ENV === 'test'
const MONGODB_URI = isTestEnv() ? env.TEST_MONGODB_URI : env.MONGODB_URI
const PORT = env.PORT

module.exports = {
  MONGODB_URI,
  PORT,
  NODE_ENV,
  isTestEnv
}