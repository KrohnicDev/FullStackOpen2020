const BlogModel = require('../models/blog')
const UserModel = require('../models/user')

const fetchBlogsFromDB = async (conditions) => {
  const blogs = (conditions)
    ? await BlogModel.find(conditions)
    : await BlogModel.find({})

  return blogs.map(blog => blog.toJSON())
}

const fetchSingleBlogFromDB = async (id) => {
  const blog = (id)
    ? await BlogModel.findById(id)
    : await BlogModel.findOne({})

  return blog.toJSON()
}

const fetchUsersFromDB = async (conditions) => {
  const users = (conditions)
    ? await UserModel.find(conditions)
    : await UserModel.find({})

  return users.map(u => u.toJSON())
}

module.exports = {
  fetchBlogsFromDB,
  fetchSingleBlogFromDB,
  fetchUsersFromDB
}