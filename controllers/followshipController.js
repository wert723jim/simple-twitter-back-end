const helpers = require('../_helpers')
const { Followship, User } = require('../models')

const makeFollow = async (req, res) => {
  const followingUser = await User.findByPk(req.body.id)
  if (!followingUser) {
    return res.status(400).json({ message: '追蹤失敗，該帳號不存在' })
  }
  const user = helpers.getUser(req)
  await Followship.create({
    followerId: user.id,
    followingId: req.body.id,
  })
  res.sendStatus(200)
}

const unFollow = (req, res) => {
  const user = helpers.getUser(req)
  Followship.destroy({
    where: {
      followerId: user.id,
      followingId: req.params.following_id,
    },
  })
  res.sendStatus(200)
}

module.exports = { makeFollow, unFollow }
