const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')

// router.post(
//   '/login',
//   passport.authenticate('local', { session: false }),
//   (req, res) => {

//     console.log(req)
//   }
// )
router.use('/users', require('./users'))
router.use('/tweets', require('./tweets'))
router.use('/followships', require('./followships'))
router.use('/admin', require('./admin'))

module.exports = router
