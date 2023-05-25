const passport = require('passport')
const LocalStrategy = require('passport-local')

passport.use(
  new LocalStrategy((username, password, done) => {
    console.log(username)
    console.log(password)
    const user = { username, password }
    return done(null, user)
  })
)

module.exports = passport
