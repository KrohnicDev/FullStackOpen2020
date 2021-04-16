const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const UserModel = require('../models/user')

usersRouter.get('/', async (req, res) => {
  const users = await UserModel
    .find({})
    .populate('blogs', { title: 1, likes: 1, url: 1, author: 1 })

  res.json(users.map(u => u.toJSON()))
})

usersRouter.get('/:id', async (req, res) => {
  const id = req.params.id
  const { name, username, blogs } = await UserModel
    .findById(id)
    .populate('blogs', { title: 1, likes: 1, url: 1, author: 1 })
  const user = { name, username, blogs }
  res.json(user.toJSON())
})

usersRouter.post('/', async (req, res) => {
  const body = req.body
  const minLengthOfPassword = 3
  const password = body.password

  if (!password || password.length < minLengthOfPassword) {
    const error = 'password must be at least ' + minLengthOfPassword + ' characters long'
    return res.status(400).send({ error })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = UserModel({
    username: body.username,
    name: body.name,
    passwordHash
  })

  const savedUser = await user.save()
  res.status(201).json(savedUser)
})

module.exports = usersRouter