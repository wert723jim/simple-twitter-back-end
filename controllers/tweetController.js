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
  try {
    const user = helpers.getUser(req)
    model.Tweet.create({
      UserId: user.id,
      description: req.body.description,
    })
    res.sendStatus(200)
  } catch (err) {
    console.log(err)
    res.status(507).json({ message: '資料庫請求錯誤' })
  }
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
        attributes: ['id', 'account', 'name', 'avatar'],
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
        attributes: ['id', 'account', 'name', 'avatar'],
      },
    ],
  })
  res.json(tweet)
  // TODO 若沒有該貼文id，則返回null，看是否需要優化
}

const addReply = async (req, res) => {
  if (!req.body.comment) {
    return res.status(400).json({ message: '請填入留言內容' })
  }
  const user = helpers.getUser(req)
  const tweetCount = await model.Tweet.count({
    where: { id: req.params.tweet_id },
  })
  if (tweetCount === 0) {
    return res.status(400).json({ message: '留言失敗，查無該貼文' })
  }
  await model.Reply.create({
    UserId: user.id,
    TweetId: req.params.tweet_id,
    comment: req.body.comment,
  })
  res.sendStatus(200)
}

const getAllReplies = async (req, res) => {
  const replies = await model.Reply.findAll({
    where: {
      tweetId: req.params.tweet_id,
    },
    attributes: {
      exclude: ['UserId', 'updatedAt'],
    },
    include: [
      {
        model: model.User,
        attributes: ['id', 'account', 'name', 'avatar'],
      },
    ],
    order: [['createdAt', 'DESC']],
  })
  res.json(replies)
  // TODO 若沒有該貼文id，則返回[]，看是否需要優化
}

const likeTweet = async (req, res) => {
  // TODO 對貼文關聯做優化，若沒有該貼文不能按讚
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

const unlikeTweet = (req, res) => {
  // TODO 若本來就沒有讚，要如何優化處理
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
