const passport = require('../config/passport')
const jwt = require('jsonwebtoken')
const User = require('../models')['User']

const verifyUserExist = (req, res, next) => {
  passport.authenticate(
    'local',
    { badRequestMessage: '請求欄位有誤' },
    (err, user, info) => {
      if (err) {
        return next(err)
      }
      if (!user) {
        return res.status(info.status || 400).json({ message: info.message })
      }
      req.user = user
      next()
    }
  )(req, res, next)
}

const verifyAccessToken = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: 'unauthorized' })
    }
    req.user = user.dataValues
    next()
  })(req, res, next)
}

const verifyRefreshToken = async (req, res, next) => {
  const token = req.cookies.jwt
  if (!token) {
    return res.status(401).json({ message: '請重新登入' })
  }
  const user = await User.findOne({ where: { refreshToken: token } })
  if (!user) {
    return res.status(403).json({ message: '發現異常，請重新登入' })
  }
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, decode) => {
    if (err) {
      user.refreshToken = null
      await user.save()
      return res.status(403).json(err)
    }
    req.user = user.dataValues
    next()
  })
}

module.exports = { verifyUserExist, verifyAccessToken, verifyRefreshToken }
