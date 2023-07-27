const express = require('express')
const router = express.Router()
const Author = require("../models/author")
const Book = require("../models/book")

//Get all authors
router.get('/', async (req, res) => {
  let searchOptions = {}
  if (req.query.name != null && req.query.name != '') {
    searchOptions.name = new RegExp(req.query.name, 'i')
  }

  try {
    const authors = await Author.find(searchOptions)
    res.render('authors/index', {
      authors: authors,
      searchOptions: req.query
    })
  } catch {
      res.redirect('/')
  }
  
})

// Get new author form
router.get('/new', (req, res) => {
  res.render('authors/new', { author: new Author({}) })
})

// Create new author
router.post('/', async (req, res) => {
  const author = new Author({
    name: req.body.name
  })

  try {
    const newAuthor = await author.save()
    res.redirect(`authors/${newAuthor.id}`)
  } catch {
    res.render('authors/new', {
      author: author,
      errorMessage: 'Error creating author'
    })
  }
})

// Get one author
router.get('/:id', async (req, res) => {
  const page = +req.query.page || 1
  const limit = 5
  const skip = (page - 1) * limit
  try {
    const author = await Author.findById(req.params.id)
    const books = await Book.find({ author: author.id })
      .sort({ publishYear: 1})
      .skip(skip)
      .limit(limit)
      .exec()
    const count = await Book.countDocuments({ author: author.id })
    const totalPages = Math.ceil(count / limit)
    res.render('authors/show', {
      author: author,
      authorBooks: books,
      currentPage: page,
      totalPages: totalPages
    })
  } catch {
    res.redirect('/')
  }
})

// Edit author
router.get('/:id/edit', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id)
    res.render('authors/edit', { author: author })
  } catch {
    res.redirect('/authors')
  }
})

// Update author
router.put('/:id', async (req, res) => {
  let author
  try {
    author = await Author.findById(req.params.id)
    author.name = req.body.name
    await author.save()
    res.redirect(`/authors/${author.id}`)
  } catch {
    if (author == null) {
      res.redirect('/')
    } else {
      res.render('authors/edit', {
        author: author,
        errorMessage: 'Error updating Author'
      })
    }
  }
})

// Delete author
router.delete('/:id', async (req, res) => {
  let author
  try {
    author = await Author.findById(req.params.id)
    await Author.deleteOne({_id: req.params.id})
    res.redirect('/authors')
  } catch {
    if (author == null) {
      res.redirect('/')
    } else {
      res.redirect(`/authors/${author.id}`)
    }
  }
})


module.exports = router