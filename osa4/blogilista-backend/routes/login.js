const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const UserModel = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const body = request.body
  const user = await UserModel.findOne({ username: body.username })
  const isPasswordCorrect = user !== null
    && await bcrypt.compare(body.password, user.passwordHash)

  if (!isPasswordCorrect) {
    return response
      .status(401)
      .send({ error: 'invalid username or password' })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({
      token,
      username: user.username,
      name: user.name
    })
})

module.exports = loginRouter