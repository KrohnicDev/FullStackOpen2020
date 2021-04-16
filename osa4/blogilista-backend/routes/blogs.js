const blogsRouter = require('express').Router()
const BlogModel = require('../models/blog')
const UserModel = require('../models/user')
const jwt = require('jsonwebtoken')
const logger = require('../utils/logger')

blogsRouter.get('/', async (_request, response) => {
  const blogs = await BlogModel
    .find({})
    .populate('user', { username: 1, name: 1 })
    .populate('comments.user', { username: 1, name: 1 }, UserModel)

  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await BlogModel
    .findById(request.params.id)
    .populate('user', { username: 1, name: 1 })
    .populate('comments.user', { username: 1, name: 1 }, UserModel)

  response.json(blog)
})

const validateToken = (token) => {
  if (!token) {
    throw new Error('token is missing')
  }

  const decodedToken = jwt.verify(token, process.env.SECRET)
  const userId = decodedToken.id

  if (!userId) {
    throw new Error('token is invalid')
  }

  return userId
}

blogsRouter.post('/', async (request, response) => {
  let loggedInUserID = null

  try {
    loggedInUserID = validateToken(request.token)
  } catch (err) {
    logger.debug(err.message)
    return response.status(401).send({ error: err.message })
  }

  const user = await UserModel.findById(loggedInUserID)
  const { title, author, url, likes } = request.body
  console.log('user', user)

  const blog = new BlogModel({
    title, author, url, likes,
    user: user._id,
    comments: []
  })

  let savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  savedBlog = await BlogModel
    .findById(savedBlog._id)
    .populate('user', { username: 1, name: 1 })
    .populate('comments.user', { username: 1, name: 1 }, UserModel)

  response.status(201).send(savedBlog.toJSON())
})

blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const { title, likes } = request.body
  const blog = { title, likes }
  const updatedBlog = await BlogModel
    .findByIdAndUpdate(id, blog, { new: true })
    .populate('user', { username: 1, name: 1 })
    .populate('comments.user', { username: 1, name: 1 }, UserModel)

  response.send(updatedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  let loggedInUser = null

  try {
    loggedInUser = validateToken(request.token)
    const id = request.params.id
    const blogToDelete = await BlogModel.findById(id)
    const blogCreator = blogToDelete.user.toString()

    if (loggedInUser !== blogCreator) {
      throw new Error('Blog can only be deleted by its creator')
    }

    await BlogModel.findByIdAndDelete(id)

  } catch (err) {
    const error = err.message
    logger.warn(error)
    return response.status(401).send({ error })
  }

  response.status(200).send()
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const body = request.body
  const blogId = request.params.id
  const blog = await BlogModel.findById(blogId)
  const comment = { content: body.content }

  try {
    const userId = validateToken(request.token)
    comment.user = userId
  } catch (error) {
    console.log('comment added by anonymous')
  }

  blog.comments = blog.comments.concat(comment)
  console.log('comment before:', blog.comments.length)

  const updatedBlog = await BlogModel
    .findByIdAndUpdate(blogId, blog, { new: true })
    .populate('user', { username: 1, name: 1 })
    .populate('comments.user', { username: 1, name: 1 }, UserModel)

  console.log('comments after update:', updatedBlog.comments.length)
  response.status(201).send(updatedBlog.toJSON())
})

module.exports = blogsRouter