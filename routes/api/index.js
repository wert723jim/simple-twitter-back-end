const router = require('express').Router()
const { getUser } = require('../../_helpers')
const registerController = require('../../controllers/registerController')
const loginController = require('../../controllers/loginController')
const refreshController = require('../../controllers/refreshController')
const {
  verifyAccessToken,
  verifyRefreshToken,
} = require('../../middleware/verify')

router.get('/test', (req, res) => {
  return res.json(req.headers)
})

router.post('/users', registerController.addNewUser)
router.use('/auth', require('./auth'))
router.get('/refresh', verifyRefreshToken, refreshController.getAccessToken)
router.get('/logout', verifyRefreshToken, loginController.handleLogout)

router.use(verifyAccessToken)
router.get('/myInfo', (req, res) => res.json(getUser(req)))
router.use('/users', require('./users'))
router.use('/tweets', require('./tweets'))
router.use('/followships', require('./followships'))
router.use('/admin', require('./admin'))

module.exports = router
