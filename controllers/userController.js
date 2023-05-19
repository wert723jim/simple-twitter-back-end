const model = require('../models');
const User = model.User;

const getAllUser = async (req, res) => {
  const users = await User.findAll();
  res.json(users);
};

const getUserById = async (req, res) => {
  // TODO 處理沒有id
  const user = await User.findOne({
    where: {
      id: req.params.id,
    },
  });
  res.json(user);
};

const getUserTweets = async (req, res) => {
  // TODO 錯誤處理
  const user = await User.findOne({
    where: {
      id: req.params.id,
    },
    include: model.Tweet,
  });
  res.json(user.Tweets);
};

const getUserTweetsReply = async (req, res) => {
  // TODO 錯誤處理
  const user = await User.findOne({
    where: {
      id: req.params.id,
    },
    include: model.Reply,
  });
  res.json(user.Replies);
};

const getUserLikes = async (req, res) => {
  // TODO 錯誤處理
  const user = await User.findOne({
    where: {
      id: req.params.id,
    },
    include: model.Like,
  });
  res.json(user.Likes);
};

const getUserFollowings = async (req, res) => {
  // TODO 錯誤處理
  const followship = await model.Followship.findAll({
    where: {
      followerId: req.params.id,
    },
  });
  res.json(followship);
};

const getUserFollowers = async (req, res) => {
  // TODO 錯誤處理
  const followship = await model.Followship.findAll({
    where: {
      followingId: req.params.id,
    },
  });
  res.json(followship);
};

const updateUserById = async (req, res) => {
  // TODO 錯誤處理
  await User.update(req.body, {
    where: {
      id: req.params.id,
    },
  });
  res.sendStatus(200);
};

module.exports = {
  getAllUser,
  getUserById,
  getUserTweets,
  getUserTweetsReply,
  getUserLikes,
  getUserFollowings,
  getUserFollowers,
  updateUserById,
};
