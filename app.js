const express = require('express')
const app = express()
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
// const helpers = require('./_helpers')  use helpers.getUser(req) to replace req.user
// const passport = require('./config/passport')
// app.use(passport.initialize())

// cors setting
app.use(cors(corsOptions))

// app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// route
app.use('/api', require('./routes/api'))

app.get('/', (req, res) => res.send('Hello World!'))

module.exports = app
