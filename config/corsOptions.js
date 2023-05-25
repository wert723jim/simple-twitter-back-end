const corsOptions = {
  origin: (origin, cb) => {
    const allowedOrigins = ['http://localhost:8080', 'http://localhost:3000']
    allowedOrigins.includes(origin) || !origin
      ? cb(null, true)
      : cb(new Error('Not allowed by CORS'))
  },
  optionsSuccessStatus: 200,
}

module.exports = corsOptions
