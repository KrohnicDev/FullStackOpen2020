const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const UserModel = require('../models/user')
const helper = require('./testHelper')
const testData = require('./testData')
const app = require('../app')
const api = supertest(app)
const usersEndpoint = '/api/users'


describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await UserModel.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new UserModel({ username: 'root', passwordHash })
    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.fetchUsersFromDB()
    const newUser = testData.getSampleUser()

    await api
      .post(usersEndpoint)
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.fetchUsersFromDB()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails when username is already in use', async () => {
    const usersAtStart = await helper.fetchUsersFromDB()
    const newUser = testData.getSampleUser()
    newUser.username = 'root'

    const result = await api
      .post(usersEndpoint)
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('unique')

    const usersAtEnd = await helper.fetchUsersFromDB()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails when password is too short', async () => {
    const usersAtStart = await helper.fetchUsersFromDB()
    const newUser = testData.getSampleUser()
    newUser.username = 'TooShortPassword'
    newUser.password = 'pw'

    await api
      .post(usersEndpoint)
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.fetchUsersFromDB()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => mongoose.connection.close())