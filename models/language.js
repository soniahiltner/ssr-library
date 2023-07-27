const mongoose = require('mongoose')

const languageSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  }
})

module.exports = mongoose.model('Language', languageSchema)