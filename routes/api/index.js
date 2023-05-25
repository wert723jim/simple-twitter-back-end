const express = require('express')
const router = express.Router()

router.use('/users', require('./users'))
router.use('/tweets', require('./tweets'))
router.use('/followships', require('./followships'))
router.use('/admin', require('./admin'))

module.exports = router
