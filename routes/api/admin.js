const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController')
const tweetController = require('../../controllers/tweetController')

router.route('/users').get(userController.getAllUser)
router.route('/tweets/:tweet_id').delete(tweetController.deleteTweet)

module.exports = router
