const mongoose = require('mongoose')

const formatSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  }
})

module.exports = mongoose.model('Format', formatSchema)