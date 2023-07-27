const express = require('express')
const router = express.Router()
const Book = require('../models/book')

// Get last 10 books
router.get('/', async (req, res) => {
  let books, count
  try {
    books = await Book.find().sort({ createdAt: 'desc' }).limit(10).exec()
  } catch {
    books = []
  }
  res.render('index', { books: books })
})

module.exports = router