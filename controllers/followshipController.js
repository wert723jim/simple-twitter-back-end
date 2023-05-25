const helpers = require('../_helpers')
const Followship = require('../models')['Followship']

const makeFollow = async (req, res) => {
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
