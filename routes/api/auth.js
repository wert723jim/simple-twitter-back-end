const router = require('express').Router()
const loginController = require('../../controllers/loginController')
const { verifyUserExist } = require('../../middleware/verify')
const passport = require('passport')
const { getUser } = require('../../_helpers')

router.post('/', verifyUserExist, loginController.authToken)
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    res.cookie('jwt', req.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000,
    })
    const user = getUser(req)
    res.json({
      id: user.id,
      account: user.account,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      accessToken: req.accessToken,
    })
  }
)
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
    accessType: 'offline',
    prompt: 'consent',
  })
)
module.exports = router
