const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const testData = require('./testData')
const BlogModel = require('../models/blog')
const UserModel = require('../models/user')
const blogsEndpoint = '/api/blogs'
const testHelper = require('./testHelper')
const initialBlogs = testData.getListWithMultipleBlogs()
let token = null
const authorization = 'Authorization'
const bearer = 'Bearer '

const testUser = {
  username: 'test-user',
  name: 'Test User',
  password: 'test-password'
}

const getNewBlog = () => {
  const blog = testData.getSampleBlog()
  blog._id = undefined
  return blog
}

const createUser = async (user) => {
  await api.post('/api/users').send(user)
}

const deleteUser = async (user) => {
  await UserModel.deleteOne(user)
}

const login = async (user) => {
  const response = await api.post('/api/login').send(user)
  return response.body.token
}

beforeAll(async () => {
  // Create a new user and log in
  await createUser(testUser)
  token = await login(testUser)
})

afterAll(async () => {
  // Delete the test user and close connection
  await deleteUser(testUser)
  mongoose.connection.close()
})

beforeEach(async () => {
  // Revert blogs back to initial state
  await BlogModel.deleteMany({})
  await BlogModel.insertMany(initialBlogs)
})

describe('when using testHelper', () => {
  test('all blogs are returned', async () => {
    const blogs = await testHelper.fetchBlogsFromDB()
    expect(blogs.length).toBe(initialBlogs.length)
  })
})

describe('when fetching all blogs', () => {
  const fetchBlogsFromAPI = async () => {
    const response = await api.get(blogsEndpoint)
    return response.body
  }

  test('blogs are returned as json', async () => {
    await api
      .get(blogsEndpoint)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const blogsFromAPI = await fetchBlogsFromAPI()
    expect(blogsFromAPI).toHaveLength(initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const blog = testData.getSampleBlog()

    // Make sure that the blog is one of initial blogs
    let blogs = initialBlogs
    let titles = blogs.map(b => b.title)
    expect(titles).toContain(blog.title)

    // Make sure that it's also present in DB
    blogs = await fetchBlogsFromAPI()
    titles = blogs.map(b => b.title)
    expect(titles).toContain(blog.title)
  })
})

describe('when fetching a single blog', () => {
  const fetchBlogFromApiWithID = async (id) => {
    const endpoint = blogsEndpoint + '/' + id
    const response = await api.get(endpoint)
    return response.body
  }

  test('a random blog has an id field', async () => {
    const blog = await testHelper.fetchSingleBlogFromDB()
    expect(blog.id).toBeDefined()
  })

  test('the API returns the correct blog', async () => {
    const blogFromModel = await testHelper.fetchSingleBlogFromDB()
    const blogFromAPI = await fetchBlogFromApiWithID(blogFromModel.id)
    expect(blogFromAPI.title).toBe(blogFromModel.title)
  })
})

describe('when adding new blogs', () => {
  test('blog is not accepted without authorization', async () => {
    const blog = getNewBlog()
    await api
      .post(blogsEndpoint)
      .send(blog)
      .expect(401)
  })

  test('a valid blog can be added', async () => {
    const blog = getNewBlog()

    await api
      .post(blogsEndpoint)
      .set(authorization, bearer + token)
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogs = await testHelper.fetchBlogsFromDB()
    expect(blogs).toHaveLength(initialBlogs.length + 1)

    const titles = blogs.map(b => b.title)
    expect(titles).toContain(blog.title)
  })

  test('a blog without likes has 0 likes after insert', async () => {
    const blog = getNewBlog()
    blog.likes = undefined
    blog.author = 'Author without likes'

    await api
      .post(blogsEndpoint)
      .set(authorization, bearer + token)
      .send(blog)
      .expect(201)

    const conditions = { title: blog.title, author: blog.author }
    const blogs = await testHelper.fetchBlogsFromDB(conditions)
    expect(blogs.length).toBe(1)
    expect(blogs[0].likes).toBe(0)
  })

  test('a blog inserted with likes has those likes', async () => {
    const blog = getNewBlog()
    blog.likes = 100
    blog.title = 'A blog with some likes'

    await api
      .post(blogsEndpoint)
      .set(authorization, bearer + token)
      .send(blog)
      .expect(201)

    const conditions = { title: blog.title, author: blog.author }
    const blogs = await testHelper.fetchBlogsFromDB(conditions)
    expect(blogs.length).toBe(1)
    expect(blogs[0].likes).toBe(blog.likes)
  })

  test('a blog is not accepted without a title and url', async () => {
    const blog = getNewBlog()
    blog.title = null

    await api
      .post(blogsEndpoint)
      .set(authorization, bearer + token)
      .send(blog)
      .expect(400)

    blog.title = 'Sample title'
    blog.url = null

    await api
      .post(blogsEndpoint)
      .set(authorization, bearer + token)
      .send(blog)
      .expect(400)
  })
})

describe('when deleting a blog', () => {
  let blogToDelete = null

  beforeEach(async () => {
    const blog = getNewBlog()
    const response = await api
      .post(blogsEndpoint)
      .set(authorization, bearer + token)
      .send(blog)

    blogToDelete = response.body
  })

  test('only one blog is deleted', async () => {
    let blogs = await testHelper.fetchBlogsFromDB()
    const initialCount = blogs.length
    expect(initialCount).toBeGreaterThan(0)

    await api
      .delete(blogsEndpoint + '/' + blogToDelete.id)
      .set(authorization, bearer + token)
      .expect(200)

    blogs = await testHelper.fetchBlogsFromDB()
    expect(blogs.length).toBe(initialCount - 1)
  })

  test('it can only be deleted by the creator', async () => {
    const anotherUser = {
      username: 'another-user',
      name: 'Another User',
      password: 'another-password'
    }

    await createUser(anotherUser)
    const anotherToken = await login(anotherUser)

    await api
      .delete(blogsEndpoint + '/' + blogToDelete.id)
      .set(authorization, bearer + anotherToken)
      .expect(401)

    await api
      .delete(blogsEndpoint + '/' + blogToDelete.id)
      .set(authorization, bearer + token)
      .expect(200)

    await deleteUser(anotherUser)
  })
})

describe('when a blog is updated', () => {
  test('title is updated correctly', async () => {
    const blog = await testHelper.fetchSingleBlogFromDB()
    const id = blog.id
    const newTitle = 'A new title'
    blog.title = newTitle
    await api.put(blogsEndpoint + '/' + id).send(blog)
    const updatedBlog = await testHelper.fetchSingleBlogFromDB(id)
    expect(updatedBlog.title).toBe(newTitle)
  })

  test('likes are updated correctly', async () => {
    const blog = await testHelper.fetchSingleBlogFromDB()
    const id = blog.id
    const newLikes = blog.likes + 100
    blog.likes = newLikes
    await api.put(blogsEndpoint + '/' + id).send(blog)
    const updatedBlog = await testHelper.fetchSingleBlogFromDB(id)
    expect(updatedBlog.likes).toBe(newLikes)
  })
})

