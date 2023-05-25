require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const corsOptions = require('./config/corsOptions')

// const helpers = require('./_helpers')  use helpers.getUser(req) to replace req.user
// const passport = require('./config/passport')
// app.use(passport.initialize())

// cors setting
app.use(cors(corsOptions))

// parse req.body
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// parse cookie
app.use(cookieParser())

// route
app.use('/api', require('./routes/api'))

module.exports = app
