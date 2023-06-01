const passport = require('passport')
const LocalStrategy = require('passport-local')
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models')['User']
const bcrypt = require('bcryptjs')
const { v4: uuid } = require('uuid')

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

// google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost/api/auth/google/callback',
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      req.accessToken = accessToken
      req.refreshToken = refreshToken
      if (!profile) {
        console.log('no profile error')
        return done('no profile error', false)
      }
      const user = await User.findOne({ where: { googleId: profile.id } })
      if (!user) {
        // create user
        const password = bcrypt.hashSync(uuid(), 10)
        const newUser = await User.create({
          account: profile._json.email,
          name: profile.displayName,
          email: profile._json.email,
          googleId: profile.id,
          avatar: profile.photos[0].value,
          password,
          refreshToken,
        })
        return done(null, newUser)
      }
      user.refreshToken = refreshToken
      await user.save()
      return done(null, user)
    }
  )
)

module.exports = passport
