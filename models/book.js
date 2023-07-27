const mongoose = require('mongoose')


const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Author'
  },
  format: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Format'
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Category'
  },
  language: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Language'
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Country'
  },
  publishYear: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  coverImage: {
    filename: String,
    url: String
  },
  comments: {
    type: String
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
})

module.exports = mongoose.model('Book', bookSchema)