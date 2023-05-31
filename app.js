require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const corsOptions = require('./config/corsOptions')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./openapi.yml')

// cors setting
app.use(cors(corsOptions))

// parse req.body
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// parse cookie
app.use(cookieParser())

// route
app.use('/api', require('./routes/api'))

// api docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

module.exports = app
