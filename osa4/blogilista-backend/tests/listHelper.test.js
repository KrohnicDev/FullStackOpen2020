
const { getListWithOneBlog, getListWithMultipleBlogs } = require('./testData')
const listHelper = require('../utils/listHelper')
const listWithOneBlog = getListWithOneBlog()
const listWithMultipleBlogs = getListWithMultipleBlogs()

test('dummy returns one', () => {
  const result = listHelper.dummy([])
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('when list has multiple blogs the total is counted', () => {
    const result = listHelper.totalLikes(listWithMultipleBlogs)
    expect(result).toBe(7 + 5 + 12 + 10 + 0 + 2)
  })
})

describe('favorite blog', () => {
  test('when list has multiple blogs the favorite is returned', () => {
    const favorite = listHelper.favoriteBlog(listWithMultipleBlogs)
    expect(favorite.likes).toBe(12)
  })
})

describe('most blogs', () => {
  test('when list has multiple blogs the author with most blogs is returned', () => {
    const result = listHelper.mostBlogs(listWithMultipleBlogs)
    expect(result.author).toBe('Robert C. Martin')
    expect(result.blogs).toBe(3)
  })
})

describe('most likes', () => {
  test('when list has multiple blogs the author with most likes is returned', () => {
    const result = listHelper.mostLikes(listWithMultipleBlogs)
    expect(result.author).toBe('Edsger W. Dijkstra')
    expect(result.likes).toBe(17)
  })
})