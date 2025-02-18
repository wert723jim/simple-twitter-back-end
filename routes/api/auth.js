const router = require('express').Router()
const loginController = require('../../controllers/loginController')
const { verifyUserExist, verifyAdminExist } = require('../../middleware/verify')

router.post('/', verifyUserExist, loginController.authToken)
router.post('/admin', verifyAdminExist, loginController.authToken)

module.exports = router
