const passport = require('passport')
const LocalStrategy = require('passport-local')
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt')
const User = require('../models')['User']
const bcrypt = require('bcryptjs')

// local
passport.use(
  new LocalStrategy(
    { usernameField: 'account' },
    async (account, password, done) => {
      // check user & password
      console.log(account, password)
      const user = await User.findOne({ where: { account } })
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return done(null, false, { message: '帳號或密碼有誤' })
      }
      return done(null, user)
    }
  )
)

// jwt
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //get jwt from header
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    },
    async (jwt_payload, done) => {
      const user = await User.findOne({
        where: { account: jwt_payload.account },
      })
      return done(null, user)
    }
  )
)

module.exports = passport
