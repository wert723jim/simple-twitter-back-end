const router = require('express').Router()
const loginController = require('../../controllers/loginController')
const { verifyUserExist } = require('../../middleware/verify')
const passport = require('passport')

router.post('/', verifyUserExist, loginController.authToken)
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    res.cookie('jwt', res.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000,
    })
    res.json(req.accessToken)
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
