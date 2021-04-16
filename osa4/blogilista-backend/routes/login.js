const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const UserModel = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body
  const user = await UserModel.findOne({ username })
  const isPasswordCorrect = user !== null
    && await bcrypt.compare(password, user.passwordHash)

  if (!isPasswordCorrect) {
    return response
      .status(401)
      .send({ error: 'invalid username or password' })
  }

  const token = jwt.sign(
    { username, id: user._id, },
    process.env.SECRET
  )

  const data = {
    token,
    username,
    name: user.name
  }

  return response
    .status(200)
    .send(data)
})

module.exports = loginRouter