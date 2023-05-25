const jwt = require('jsonwebtoken')
const User = require('../models')['User']

const authToken = async (req, res) => {
  // make refresh token && save in cookie
  const refreshToken = jwt.sign(
    { account: req.user.account, type: 'refresh' },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '1d' }
  )
  const user = await User.findOne({ where: { account: req.user.account } })
  user.refreshToken = refreshToken
  await user.save()
  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 24 * 60 * 60 * 1000,
  })

  // make access token && send by json
  const accessToken = jwt.sign(
    { account: req.user.account, type: 'access' },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '30s' }
  )
  res.json(accessToken)
}

const handleLogout = async (req, res) => {
  const refreshToken = req.cookies.jwt
  const user = await User.findOne({ where: { refreshToken } })
  user.refreshToken = null
  await user.save()
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
  res.sendStatus(204)
}

module.exports = { authToken, handleLogout }
