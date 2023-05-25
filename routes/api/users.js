const router = require('express').Router()
const userController = require('../../controllers/userController')

// users api
router.route('/:id/tweets').get(userController.getUserTweets)
router.route('/:id/replied_tweets').get(userController.getUserTweetsReply)
router.route('/:id/likes').get(userController.getUserLikes)
router.route('/:id/followings').get(userController.getUserFollowings)
router.route('/:id/followers').get(userController.getUserFollowers)
router.route('/:id').get(userController.getUserById)
router.route('/:id').put(userController.updateUserById)

module.exports = router
