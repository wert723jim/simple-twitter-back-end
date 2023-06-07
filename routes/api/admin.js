const router = require('express').Router()
const userController = require('../../controllers/userController')
const tweetController = require('../../controllers/tweetController')
const { verifyAdminRole } = require('../../middleware/verify')

router.route('/users').get(userController.getAllUser)
router
  .route('/tweets/:tweet_id')
  .delete(verifyAdminRole, tweetController.deleteTweet)

module.exports = router
