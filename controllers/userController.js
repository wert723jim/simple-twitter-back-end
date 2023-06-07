const sequelize = require('sequelize')
const model = require('../models')
const bcrypt = require('bcryptjs')
const User = model.User
const { Op } = require('sequelize')
const jwt = require('jsonwebtoken')
const { getUser } = require('../_helpers')

const getAllUser = async (req, res) => {
  const users = await User.findAll({
    raw: true,
    nest: true,
    attributes: [
      'id',
      'account',
      'name',
      'avatar',
      'cover',
      [
        sequelize.literal(
          `(SELECT 1 FROM Followships WHERE Followships.followerId = '${
            req.user.role === 'user' ? req.user.id : 0
          }' AND Followships.followingId = User.id)`
        ),
        'followed',
      ],
      [
        sequelize.literal(
          '(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id)'
        ),
        'tweet_count',
      ],
      [sequelize.fn('COUNT', sequelize.col('Tweets.Likes.id')), 'like_count'],
      [
        sequelize.literal(
          '(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = User.id)'
        ),
        'following_count',
      ],
      [
        sequelize.literal(
          '(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'
        ),
        'follower_count',
      ],
    ],
    include: [
      {
        model: model.Tweet,
        attributes: ['id'],
        include: { model: model.Like },
      },
    ],
    order: [['createdAt', 'DESC']],
    group: ['id'],
  })
  const result = users.map((user) => {
    delete user.Tweets
    return user
  })
  res.json(result)
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
      'cover',
      [
        sequelize.literal(
          `(SELECT 1 FROM Followships WHERE Followships.followerId = '${req.user.id}' AND Followships.followingId = '${req.params.id}')`
        ),
        'followed',
      ],
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
  const replis = await model.Reply.findAll({
    raw: true,
    nest: true,
    where: {
      UserId: userId,
    },
    attributes: [
      'id',
      'TweetId',
      'comment',
      'createdAt',
      [sequelize.col('Tweet.User.id'), 'tweet_user.id'],
      [sequelize.col('Tweet.User.account'), 'tweet_user.account'],
      [sequelize.col('Tweet.User.name'), 'tweet_user.name'],
      [sequelize.col('Tweet.User.avatar'), 'tweet_user.avatar'],
    ],
    include: [
      {
        model: model.Tweet,
        attributes: [],
        include: {
          model: model.User,
          attributes: [],
        },
      },
      {
        model: model.User,
        as: 'reply_user',
        attributes: ['id', 'account', 'name', 'avatar'],
      },
    ],
    order: [['createdAt', 'DESC']],
  })

  return res.json(replis)
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
  const followingUsers = await model.Followship.findAll({
    where: {
      followerId: req.params.id,
    },
    attributes: [
      ['followingId', 'id'],
      [sequelize.col('Followings.account'), 'account'],
      [sequelize.col('Followings.name'), 'name'],
      [sequelize.col('Followings.avatar'), 'avatar'],
      [sequelize.col('Followings.introduction'), 'introduction'],
    ],
    include: {
      model: model.User,
      as: 'Followings',
      attributes: [],
    },
  })
  return res.json(followingUsers)
}

const getUserFollowers = async (req, res) => {
  const foundUser = await User.findByPk(req.params.id)
  if (!foundUser) {
    return res.status(400).json({ message: '帳號不存在' })
  }
  const followerUsers = await model.Followship.findAll({
    where: {
      followingId: req.params.id,
    },
    attributes: [
      ['followerId', 'id'],
      [sequelize.col('Followers.account'), 'account'],
      [sequelize.col('Followers.name'), 'name'],
      [sequelize.col('Followers.avatar'), 'avatar'],
      [sequelize.col('Followers.introduction'), 'introduction'],
    ],
    include: {
      model: model.User,
      as: 'Followers',
      attributes: [],
    },
  })
  res.json(followerUsers)
}

const updateUserById = async (req, res) => {
  // 只能修改自己的帳號資訊
  const user = getUser(req)
  if (req.params.id.toString() !== user.id.toString()) {
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
    req.body.account = user.account
  }

  // account & name 不能重複
  const duplicateUser = await User.findOne({
    where: {
      id: { [Op.not]: user.id },
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
  if (foundUser.account !== req.body.account && !user.name === 'root') {
    const refreshToken = jwt.sign(
      { account: user.account, type: 'refresh' },
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
      { account: user.account, type: 'access' },
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
    console.log(err)
    return res.status(507).json({ message: '資料庫請求錯誤' })
  }
}

const getMyInfo = async (req, res) => {
  const user = getUser(req)
  res.json({
    id: user.id,
    account: user.account,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
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
