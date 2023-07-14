const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  publishDate: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  format: {
    type: String,
    enum: ['ebook', 'paper']
  },
  category: {
    type: String,
    enum: ['mystery', 'historical fiction', 'fantasy', 'romance', 'science fiction', 'poetry', 'horror', 'fable', 'mythology', 'nonfiction', 'autobiography', 'biography', 'comedy', 'tragedy', 'western', 'bildungsroman', 'history', 'memoirs', 'travelogue']
  },
  language: {
    type: String,
    enum: ['english', 'spanish', 'french', 'german', 'italian', 'galician', 'other']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Author'
  },
  coverImage: {
    type: Buffer,
    required: true
  }
})