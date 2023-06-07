const helpers = require('../_helpers')
const model = require('../models')
const sequelize = require('sequelize')

const addTweet = async (req, res) => {
  if (!req.body.description) {
    return res.status(400).json({ message: '請填入貼文內容' })
  }
  if (req.body.description.length > 140) {
    return res.status(400).json({ message: '貼文內容不得大於140字' })
  }
  try {
    const user = helpers.getUser(req)
    const result = await model.Tweet.create({
      UserId: user.id,
      description: req.body.description,
    })
    return res.json({tweet_id: result.id})
  } catch (err) {
    console.log(err)
    res.status(507).json({ message: '資料庫請求錯誤' })
  }
}

const getAllTweet = async (req, res) => {
  const userId = req.user.id
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
        [
          sequelize.literal(
            `(SELECT 1 FROM Likes WHERE Likes.TweetId = Tweet.id AND Likes.UserId = ${userId})`
          ),
          'liked',
        ],
      ],
      exclude: ['UserId'],
    },
    include: [
      {
        model: model.User,
        attributes: ['id', 'account', 'name', 'avatar'],
      },
    ],
    order: [['createdAt', 'DESC']],
  })
  res.json(tweets)
}

const getTweetById = async (req, res) => {
  const userId = req.user.id
  const tweet = await model.Tweet.findOne({
    where: {
      id: req.params.tweet_id,
    },
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
        [
          sequelize.literal(
            `(SELECT 1 FROM Likes WHERE Likes.TweetId = Tweet.id AND Likes.UserId = ${userId})`
          ),
          'liked',
        ],
      ],
      exclude: ['UserId'],
    },
    include: [
      {
        model: model.User,
        attributes: ['id', 'account', 'name', 'avatar'],
      },
    ],
  })
  if (!tweet) {
    return res.status(400).json({ message: '貼文不存在' })
  }
  res.json(tweet)
}

const addReply = async (req, res) => {
  if (!req.body.comment) {
    return res.status(400).json({ message: '請填入留言內容' })
  }
  const user = helpers.getUser(req)
  const tweetCount = await model.Tweet.findByPk(req.params.tweet_id)
  if (!tweetCount) {
    return res.status(400).json({ message: '貼文不存在' })
  }
  await model.Reply.create({
    UserId: user.id,
    TweetId: req.params.tweet_id,
    comment: req.body.comment,
  })
  res.sendStatus(200)
}

const getAllReplies = async (req, res) => {
  const foundTweet = await model.Tweet.findByPk(req.params.tweet_id)
  if (!foundTweet) {
    return res.status(400).json({ message: '貼文不存在' })
  }
  const replies = await model.Reply.findAll({
    where: {
      TweetId: req.params.tweet_id,
    },
    attributes: {
      exclude: ['UserId', 'updatedAt'],
    },
    include: [
      {
        model: model.User,
        as: 'reply_user',
        attributes: ['id', 'account', 'name', 'avatar'],
      },
    ],
    order: [['createdAt', 'DESC']],
  })
  res.json(replies)
}

const likeTweet = async (req, res) => {
  const foundTweet = await model.Tweet.findByPk(req.params.tweet_id)
  if (!foundTweet) {
    return res.status(400).json({ message: '貼文不存在' })
  }
  const user = helpers.getUser(req)
  try {
    const [row, created] = await model.Like.findOrCreate({
      where: {
        UserId: user.id,
        TweetId: req.params.tweet_id,
      },
    })
    if (created) {
      return res.sendStatus(200)
    }
    return res.status(422).json({ message: '已經對該貼文按過讚了' })
  } catch (err) {
    res.status(507).json({ message: '資料庫請求錯誤' })
  }
}

const unlikeTweet = async (req, res) => {
  const foundTweet = await model.Tweet.findByPk(req.params.tweet_id)
  if (!foundTweet) {
    return res.status(400).json({ message: '貼文不存在' })
  }
  const user = helpers.getUser(req)
  try {
    model.Like.destroy({
      where: {
        userId: user.id,
        tweetId: req.params.tweet_id,
      },
    })
    res.sendStatus(200)
  } catch (err) {
    res.status(507).json({ message: '資料庫請求錯誤' })
  }
}

const deleteTweet = async (req, res) => {
  const foundTweet = await model.Tweet.findByPk(req.params.tweet_id)
  if (!foundTweet) {
    return res.stauts(400).json({ message: '刪除失敗，查無該貼文' })
  }
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
