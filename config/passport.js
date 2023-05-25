const passport = require('passport')
const LocalStrategy = require('passport-local')

passport.use(
  new LocalStrategy((username, password, done) => {
    console.log(username)
    console.log(password)
    // return done(null, false, { message: 'this is not OK' })
    return done('errrrrror', false, { message: 'this is not OK' })
    const user = { username, password }
    return done(null, user)
  })
)

module.exports = passport
