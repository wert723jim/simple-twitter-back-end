const helpers = require('../_helpers')
const model = require('../models')
const sequelize = require('sequelize')

const addTweet = (req, res) => {
  if (!req.body.description) {
    return res.status(400).json({ message: '請填入貼文內容' })
  }
  if (req.body.description.length > 140) {
    return res.status(400).json({ message: '貼文內容不得大於140字' })
  }
  // TODO 資料庫錯誤處理
  const user = helpers.getUser(req)
  model.Tweet.create({
    UserId: user.id,
    description: req.body.description,
  })
  res.sendStatus(200)
}

const getAllTweet = async (req, res) => {
  const tweets = await model.Tweet.findAll({
    attributes: {
      include: [
        [
          sequelize.literal(
            '(SELECT COUNT(id) FROM Replies WHERE Replies.TweetId = Tweet.id)'
          ),
          'replyCount',
        ],
        [
          sequelize.literal(
            '(SELECT COUNT(id) FROM Likes WHERE Likes.TweetId = Tweet.id)'
          ),
          'likeCount',
        ],
      ],
      exclude: ['UserId'],
    },
    include: [
      {
        model: model.User,
        attributes: ['account', 'name', 'avatar'],
      },
    ],
    order: [['createdAt', 'DESC']],
  })
  res.json(tweets)
}

const getTweetById = async (req, res) => {
  const tweet = await model.Tweet.findOne({
    where: {
      id: req.params.tweet_id,
    },
    attributes: {
      include: [
        [
          sequelize.literal(
            '(SELECT COUNT(id) FROM Likes WHERE Likes.TweetId = Tweet.id)'
          ),
          'likeCount',
        ],
      ],
      exclude: ['UserId'],
    },
    include: [
      {
        model: model.User,
        attributes: ['account', 'name', 'avatar'],
      },
      {
        model: model.Reply,
        include: [
          {
            model: model.User,
            attributes: ['account', 'name', 'avatar'],
          },
        ],
      },
    ],
    order: [[model.Reply, 'createdAt', 'DESC']],
  })
  res.json(tweet)
}

const addReply = async (req, res) => {
  const user = helpers.getUser(req)
  await model.Reply.create({
    UserId: user.id,
    T
    weetId: req.params.tweet_id,
    comment: req.body.comment,
  })
  res.sendStatus(200)
}

const getAllReplies = async (req, res) => {
  const replies = await model.Reply.findAll({
    where: {
      tweetId: req.params.tweet_id,
    },
  })
  res.json(replies)
}

const likeTweet = async (req, res) => {
  const user = helpers.getUser(req)
  await model.Like.create({
    UserId: user.id,
    TweetId: req.params.tweet_id,
  })
  res.sendStatus(200)
}

const unlikeTweet = (req, res) => {
  const user = helpers.getUser(req)
  model.Like.destroy({
    where: {
      userId: user.id,
      tweetId: req.params.tweet_id,
    },
  })
  res.sendStatus(200)
}

const deleteTweet = (req, res) => {
  model.Tweet.destroy({
    where: {
      id: req.params.tweet_id,
    },
  })
  res.sendStatus(200)
}

module.exports = {
  addTweet,
  getAllTweet,
  getTweetById,
  addReply,
  getAllReplies,
  likeTweet,
  unlikeTweet,
  deleteTweet,
}
