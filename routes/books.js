const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')
const Category = require('../models/category')
const Country = require('../models/country')
const Format = require('../models/format')
const Language = require('../models/language')

const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'coverImages',
    allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'tiff'],
    maxImageFileSize: 2000000
  }
})

//Multer
const upload = multer({ storage: storage })

// Get all books
router.get('/', async (req, res) => {
  const page = +req.query.page || 1
  const limit = 10
  const skip = (page - 1) * limit
  
  try {
    const count = await Book.countDocuments().exec()
    const totalPages = Math.ceil(count / limit)
    
    const books = await Book.find()
      .sort({ publishYear: 1 })
      .skip(skip)
      .limit(limit)
      .exec()
  
    res.render('books/index', {
      books: books,
      totalPages: totalPages,
      currentPage: page,
      count: count
    })
    
  } catch {
    res.redirect('/')
  }
})

//Search book
router.get('/search', async (req, res) => {

  try {
    const categories = await Category.find({}).sort({ name: 1 })
    const formats = await Format.find({})
    const countries = await Country.find({}).sort({ name: 1 })
    const languages = await Language.find({}).sort({ name: 1 })
    
    res.render('books/search', {
      categories: categories,
      formats: formats,
      countries: countries,
      languages: languages,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// Get search results
router.get('/results', async (req, res) => {
  const page = +req.query.page || 1
  const limit = 10
  const skip = (page - 1) * limit
  let query = Book.find()
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
    query = query.gte('publishYear', req.query.publishedAfter)
  }
  if ((req.query.publishedBefore != null) & (req.query.publishedBefore != '')) {
    query = query.lte('publishYear', req.query.publishedBefore)
  }
  if (req.query.category != null && req.query.category != '') {
    query = query.where('category').equals(req.query.category)
  }
  if (req.query.format != null && req.query.format != '') {
    query = query.where('format').equals(req.query.format)
  }
  if (req.query.country != null && req.query.country != '') {
    query = query.where('country').equals(req.query.country)
  }
  if (req.query.language != null && req.query.language != '') {
    query = query.where('language').equals(req.query.language)
  }

  try {
    const books = await query
      .sort({ publishYear: 1 })
      .exec()

    res.render('books/search-result', {
      books: books
    })
  } catch {
    res.redirect('/')
  }
})

// New book
router.get('/new', async (req, res) => {
  try {
    const authors = await Author.find({}).sort({ name: 1 })
    const categories = await Category.find({}).sort({ name: 1 })
    const formats = await Format.find({})
    const countries = await Country.find({}).sort({ name: 1 })
    const languages = await Language.find({}).sort({ name: 1 })
    const book = new Book()
    res.render('books/new', {
      authors: authors,
      book: book,
      categories: categories,
      formats: formats,
      countries: countries,
      languages: languages
    })
  } catch {
    res.redirect('/books')
  }
})


// Show book
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate(['author', 'category', 'format', 'country', 'language'])
      .exec()
    res.render('books/show', { book: book })
  } catch {
    res.redirect('/')
  }
})

// Create new book
router.post('/', upload.single('coverImage'), async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    description: req.body.description.trim(),
    country: req.body.country,
    publishYear: req.body.publishYear,
    format: req.body.format,
    category: req.body.category,
    language: req.body.language,
    comments: req.body.comments.trim(),
    coverImage: {
      filename: req.file.filename,
      url: req.file.path
    }
  })
  try {
    const newBook = await book.save()
    res.redirect(`/books/${newBook.id}`)
  } catch {
    res.redirect('/')
  }
})

// Edit book route
router.get('/:id/edit', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    const authors = await Author.find({}).sort({ name: 1 })
    const categories = await Category.find({}).sort({ name: 1 })
    const formats = await Format.find({})
    const countries = await Country.find({}).sort({ name: 1 })
    const languages = await Language.find({}).sort({ name: 1 })
    const params = {
      book: book,
      authors: authors,
      categories: categories,
      formats: formats,
      countries: countries,
      languages: languages
    }
    res.render('books/edit', params)
  } catch {
    res.redirect('/books')
  }
})

// Update book
router.put('/:id', upload.single('coverImage'), async (req, res) => {
  let book
  try {
    book = await Book.findById(req.params.id)
    const imagePublicId = book.coverImage.filename
    book.title = req.body.title
    book.author = req.body.author
    book.description = req.body.description.trim()
    book.country = req.body.country
    book.format = req.body.format
    book.category = req.body.category
    book.language = req.body.language
    book.publishYear = req.body.publishYear
    book.comments = req.body.comments.trim()
  
    if (req.file) {
      if (imagePublicId) {
        await cloudinary.uploader.destroy(imagePublicId)
      }
      book.coverImage = {
        filename: req.file.filename,
        url: req.file.path
      }
    }
    await book.save()
    res.redirect(`/books/${book.id}`)
  } catch {
    const authors = await Author.find({}).sort({ name: 1 })
    const categories = await Category.find({}).sort({ name: 1 })
    const formats = await Format.find({})
    const countries = await Country.find({}).sort({ name: 1 })
    const languages = await Language.find({}).sort({ name: 1 })
    const params = {
      book: book,
      authors: authors,
      categories: categories,
      formats: formats,
      countries: countries,
      languages: languages,
      errorMessage: 'Error updating Book'
    }
    res.render('books/edit', params)
  }
  

})

// Delete book
router.delete('/:id', async (req, res) => {
  let book 
  try {
    book = await Book.findById(req.params.id)
    const imagePublicId = book.coverImage.filename
    await Book.deleteOne({ _id: req.params.id })
    await cloudinary.uploader.destroy(imagePublicId)
    res.redirect('/books')
  } catch  {
    if (book == null) {
      res.redirect('/')
    } else {
      res.redirect(`/books/${book.id}`)
    }
  }
})

module.exports = router
