const express = require('express');
const router = express.Router();
const tweetController = require('../../controllers/tweetController');

// tweets api
router.route('/:tweet_id/replies').post(tweetController.addReply);
router.route('/:tweet_id/replies').get(tweetController.getAllReplies);
router.route('/:tweet_id/like').post(tweetController.likeTweet);
router.route('/:tweet_id/unlike').post(tweetController.unlikeTweet);
router.route('/:tweet_id').get(tweetController.getTweetById);
router.route('/').post(tweetController.addTweet);
router.route('/').get(tweetController.getAllTweet);

module.exports = router;
