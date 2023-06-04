const sequelize = require('sequelize')
const model = require('../models')
const User = model.User

const getAllUser = async (req, res) => {
  const users = await User.findAll({
    attributes: [
      'id',
      'account',
      'name',
      'email',
      'avatar',
      'introduction',
      'role',
    ],
    order: [['createdAt', 'DESC']],
  })
  res.json(users)
}

const getUserById = async (req, res) => {
  const user = await User.findOne({
    where: {
      id: req.params.id,
    },
    attributes: [
      'id',
      'account',
      'name',
      'email',
      'role',
      'introduction',
      'avatar',
    ],
  })
  if (!user) {
    return res.status(400).json({ message: '查無此帳號' })
  }
  res.json(user)
}

const getUserTweets = async (req, res) => {
  const tweets = await model.Tweet.findAll({
    where: { UserId: req.params.id },
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

const getUserTweetsReply = async (req, res) => {
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
        model: model.Reply,
        where: { UserId: req.params.id },
        attributes: [],
      },
      {
        model: model.User,
        attributes: ['id', 'account', 'name', 'avatar'],
      },
    ],
    order: [['createdAt', 'DESC']],
  })
  res.json(tweets)
}

const getUserLikes = async (req, res) => {
  const tweets = await model.Tweet.findAll({
    attributes: {
      include: [
        ['id', 'TweetId'],
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
        model: model.Like,
        where: { UserId: req.params.id },
        attributes: [],
      },
      {
        model: model.User,
        attributes: ['id', 'account', 'name', 'avatar'],
      },
    ],
    order: [['createdAt', 'DESC']],
  })
  res.json(tweets)
}

const getUserFollowings = async (req, res) => {
  const followship = await model.Followship.findAll({
    raw: true,
    where: {
      followerId: req.params.id,
    },
    attributes: ['followingId'],
    include: {
      model: model.User,
      as: 'Followings',
      attributes: ['account', 'name', 'avatar'],
    },
  })
  res.json(followship)
}

const getUserFollowers = async (req, res) => {
  const followship = await model.Followship.findAll({
    raw: true,
    where: {
      followingId: req.params.id,
    },
    attributes: ['followerId'],
    include: {
      model: model.User,
      as: 'Followers',
      attributes: ['account', 'name', 'avatar'],
    },
  })
  res.json(followship)
}

const updateUserById = async (req, res) => {
  // TODO 錯誤處理
  // TODO admin帳號才能操作
  // TODO 考慮不能修改的欄位
  await User.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
  res.sendStatus(200)
}

const getMyInfo = async (req, res) => {
  res.json({
    id: req.user.id,
    account: req.user.account,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    avatart: req.user.avatar,
  })
}

module.exports = {
  getAllUser,
  getUserById,
  getUserTweets,
  getUserTweetsReply,
  getUserLikes,
  getUserFollowings,
  getUserFollowers,
  updateUserById,
  getMyInfo,
}
