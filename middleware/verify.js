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

const verifyAdminExist = (req, res, next) => {
  passport.authenticate(
    'local_admin',
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
  let user
  user = await User.findOne({ where: { refreshToken: token } })
  if (!user) {
    user = await Admin.findOne({ where: { refreshToken: token } })
  }
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

const verifyAdminRole = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(401).json({ message: '權限不足' })
  }
  next()
}

module.exports = {
  verifyUserExist,
  verifyAdminExist,
  verifyAccessToken,
  verifyRefreshToken,
  verifyAdminRole,
}
