const sequelize = require('sequelize')
const model = require('../models')
const bcrypt = require('bcryptjs')
const User = model.User
const { Op } = require('sequelize')
const jwt = require('jsonwebtoken')

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
    return res.status(400).json({ message: '帳號不存在' })
  }
  res.json(user)
}

const getUserTweets = async (req, res) => {
  const userId = req.params.id
  const foundUser = await User.findByPk(userId)
  if (!foundUser) {
    return res.status(400).json({ message: '帳號不存在' })
  }
  const tweets = await model.Tweet.findAll({
    where: { UserId: userId },
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

const getUserTweetsReply = async (req, res) => {
  const userId = req.params.id
  const foundUser = await User.findByPk(userId)
  if (!foundUser) {
    return res.status(400).json({ message: '帳號不存在' })
  }
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
        model: model.Reply,
        where: { UserId: userId },
        attributes: ['comment'],
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
  const foundUser = await User.findByPk(req.params.id)
  if (!foundUser) {
    return res.status(400).json({ message: '帳號不存在' })
  }
  try {
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
          [sequelize.literal('(SELECT 1 FROM Likes LIMIT 1)'), 'liked'],
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
    return res.json(tweets)
  } catch (err) {
    return res.status(507).json({ message: '資料庫錯誤' })
  }
}

const getUserFollowings = async (req, res) => {
  const foundUser = await User.findByPk(req.params.id)
  if (!foundUser) {
    return res.status(400).json({ message: '帳號不存在' })
  }
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
  const foundUser = await User.findByPk(req.params.id)
  if (!foundUser) {
    return res.status(400).json({ message: '帳號不存在' })
  }
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
  // 只能修改自己的帳號資訊
  if (req.params.id.toString() !== req.user.id.toString()) {
    return res.status(400).json({ message: '只能修改自己的帳號資訊' })
  }
  const foundUser = await User.findByPk(req.params.id)
  // 若有密碼欄位，檢驗密碼是否有誤
  if (req.body.password || req.body.checkPassword) {
    if (req.body.password !== req.body.checkPassword) {
      return res.status(400).json({ message: '密碼和確認密碼不一致' })
    }
    if (!bcrypt.compareSync(req.body.checkPassword, foundUser.password)) {
      return res.status(400).json({ message: '密碼有誤' })
    }
    delete req.body.password
    delete req.body.checkPassword
  } else {
    req.body.account = req.user.account
  }
  // account & name 不能重複
  const duplicateUser = await User.findOne({
    where: {
      id: { [Op.not]: req.user.id },
      [Op.or]: [{ account: req.body.account }, { name: req.body.name }],
    },
  })
  if (duplicateUser) {
    const dupField =
      duplicateUser.account === req.body.account ? '帳號' : '名稱'
    return res.status(400).json({ message: `${dupField}已經被使用過了` })
  }

  // 若更新account，要重新給jwt
  let accessToken
  if (foundUser.account !== req.body.account) {
    const refreshToken = jwt.sign(
      { account: req.user.account, type: 'refresh' },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    )
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000,
    })
    foundUser.refreshToken = refreshToken

    accessToken = jwt.sign(
      { account: req.user.account, type: 'access' },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '30s' }
    )
  }

  try {
    for (let [key, val] of Object.entries(req.body)) {
      foundUser[key] = val
    }
    await foundUser.save()
    if (accessToken) {
      return res.json({ accessToken })
    }
    return res.sendStatus(200)
  } catch (err) {
    return res.status(507).json({ message: '資料庫請求錯誤' })
  }
}

const getMyInfo = async (req, res) => {
  res.json({
    id: req.user.id,
    account: req.user.account,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    avatar: req.user.avatar,
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
