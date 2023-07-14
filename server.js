if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')

//Routes
const indexRouter = require('./routes/index')
const authorsRouter = require('./routes/authors')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

app.use('/', indexRouter)
app.use('/authors', authorsRouter)


//Database
const mongoose = require('mongoose')
const uri = process.env.MONGO_URI
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'library'
})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.listen(process.env.PORT || 3000)
