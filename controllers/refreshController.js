const jwt = require('jsonwebtoken')

const getAccessToken = async (req, res) => {
  const accessToken = jwt.sign(
    { account: req.user.account, type: 'access' },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '30s' }
  )
  return res.status(200).json(accessToken)
}

module.exports = { getAccessToken }
