const helpers = require('../_helpers')
const { Followship, User } = require('../models')

const makeFollow = async (req, res) => {
  if (req.body.id === req.user.id) {
    return res.status(400).json({ message: '無法追蹤自己' })
  }
  const followingUser = await User.findByPk(req.body.id)
  if (!followingUser) {
    return res.status(400).json({ message: '追蹤失敗，該帳號不存在' })
  }
  const user = helpers.getUser(req)
  const [followship, created] = await Followship.findOrCreate({
    where: {
      followerId: user.id,
      followingId: req.body.id,
    },
  })
  if (created) {
    return res.sendStatus(200)
  }
  return res.status(400).json({ message: '已經追蹤過' })
}

const unFollow = async (req, res) => {
  const followingUser = await User.findByPk(req.params.following_id)
  if (!followingUser) {
    return res.status(400).json({ message: '帳號不存在' })
  }
  const user = helpers.getUser(req)
  const delCount = await Followship.destroy({
    where: {
      followerId: user.id,
      followingId: req.params.following_id,
    },
  })
  if (delCount === 1) {
    return res.sendStatus(200)
  }
  return res.status(400).json({ message: '尚未追蹤' })
}

module.exports = { makeFollow, unFollow }
