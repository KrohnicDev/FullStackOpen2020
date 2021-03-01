const UserModel = require('../models/user')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const loginEndpoint = '/api/login'
const usersEndpoint = '/api/users'

describe('when there is initially one user present', () => {
  const validUser = {
    username: 'root',
    password: 'salainen',
    name: 'Salainen nimi'
  }

  beforeEach(async () => {
    await UserModel.deleteMany({})
    await api.post(usersEndpoint).send(validUser)
  })

  test('the user can login successfully with a correct password', async () => {
    await api
      .post(loginEndpoint)
      .send(validUser)
      .expect(200)
  })

  test('the user cannot login with an incorrect password', async () => {
    const invalidUser = { ...validUser }
    invalidUser.password = 'invalid'

    await api
      .post(loginEndpoint)
      .send(invalidUser)
      .expect(401)
  })

  test('an unknown user cannot login', async () => {
    const user = { ...validUser }
    user.username = 'unknown username'

    await api
      .post(loginEndpoint)
      .send(user)
      .expect(401)
  })
})

afterAll(() => mongoose.connection.close())