const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Quote = require('../models/quote')

// Get last 10 books
router.get('/', async (req, res) => {
  let books, quote
  try {
    books = await Book.find().sort({ createdAt: 'desc' }).limit(10).exec()
    const count = await Quote.countDocuments().exec()
    const random = Math.floor(Math.random() * count)
    quote = await Quote.findOne().skip(random).exec()
  } catch (err) {
    books = []
    console.log(err)
  }
  res.render('index', { books: books, quote: quote })
})

module.exports = router
