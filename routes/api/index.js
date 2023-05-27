const router = require('express').Router()
const registerController = require('../../controllers/registerController')
const loginController = require('../../controllers/loginController')
const refreshController = require('../../controllers/refreshController')
const {
  verifyAccessToken,
  verifyRefreshToken,
} = require('../../middleware/verify')

router.post('/users', registerController.addNewUser)
router.use('/auth', require('./auth'))
// router.post('/auth', verifyUserExist, loginController.authToken)
router.get('/refresh', verifyRefreshToken, refreshController.getAccessToken)
router.get('/logout', verifyRefreshToken, loginController.handleLogout)

router.use(verifyAccessToken)
router.use('/users', require('./users'))
router.use('/tweets', require('./tweets'))
router.use('/followships', require('./followships'))
router.use('/admin', require('./admin'))

module.exports = router
