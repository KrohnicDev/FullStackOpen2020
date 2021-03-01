const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => sum + blog.likes
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  let maxLikes = 0
  let favorite = null

  for (let blog of blogs) {
    if (blog.likes > maxLikes) {
      maxLikes = blog.likes
      favorite = blog
    }
  }

  return favorite
}

const mostBlogs = (blogs) => {
  const authors = {}

  for (const blog of blogs) {
    const name = blog.author
    if (authors[name]) {
      authors[name] += 1
    } else {
      authors[name] = 1
    }
  }

  const result = maxChild(authors)

  return {
    author: result.key,
    blogs: result.value
  }
}

const mostLikes = (blogs) => {
  const authors = {}

  for (const blog of blogs) {
    const name = blog.author
    const likes = blog.likes

    if (authors[name]) {
      authors[name] += likes
    } else {
      authors[name] = likes
    }
  }

  const result = maxChild(authors)

  return {
    author: result.key,
    likes: result.value
  }
}

// Helper function to find child object with maximum value (e.g. author's count of blogs)
const maxChild = (parent) => {
  let result = null
  let maxValue = Number.MIN_VALUE

  for (const [key, value] of Object.entries(parent)) {
    if (value > maxValue) {
      result = { key, value }
      maxValue = value
    }
  }

  return result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}