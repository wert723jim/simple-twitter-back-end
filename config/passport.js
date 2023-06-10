const passport = require('passport')
const LocalStrategy = require('passport-local')
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt')
const { User, Admin } = require('../models')
const bcrypt = require('bcryptjs')

// local
passport.use(
  new LocalStrategy(
    { usernameField: 'account' },
    async (account, password, done) => {
      // check user & password
      const user = await User.findOne({ where: { account } })
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return done(null, false, { message: '帳號或密碼有誤' })
      }
      return done(null, user)
    }
  )
)

// local admin
passport.use(
  'local_admin',
  new LocalStrategy(
    { usernameField: 'account' },
    async (account, password, done) => {
      // check user & password
      const admin = await Admin.findOne({ where: { account } })
      if (!admin || !bcrypt.compareSync(password, admin.password)) {
        return done(null, false, { message: '帳號或密碼有誤' })
      }
      return done(null, admin)
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
      let user
      user = await User.findOne({
        where: { account: jwt_payload.account },
      })
      if (!user) {
        user = await Admin.findOne({
          where: { account: jwt_payload.account },
        })
      }
      return done(null, user)
    }
  )
)

module.exports = passport
