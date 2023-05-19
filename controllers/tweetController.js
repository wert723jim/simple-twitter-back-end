const helpers = require('../_helpers');
const model = require('../models');

const addTweet = (req, res) => {
  const user = helpers.getUser(req);
  model.Tweet.create({
    UserId: user.id,
    description: req.body.description,
  });
  res.sendStatus(200);
};

const getAllTweet = async (req, res) => {
  const tweets = await model.Tweet.findAll({}, { include: model.User });
  res.json(tweets);
};

const getTweetById = async (req, res) => {
  const tweet = await model.Tweet.findOne({
    where: {
      id: req.params.tweet_id,
    },
  });
  res.json(tweet);
};

const addReply = async (req, res) => {
  const user = helpers.getUser(req);
  await model.Reply.create({
    userId: user.id,
    tweetId: req.params.tweet_id,
    comment: req.body.comment,
  });
  res.sendStatus(200);
};

const getAllReplies = async (req, res) => {
  const replies = await model.Reply.findAll({
    where: {
      tweetId: req.params.tweet_id,
    },
  });
  res.json(replies);
};

const likeTweet = async (req, res) => {
  const user = helpers.getUser(req);
  await model.Like.create({
    userId: user.id,
    tweetId: req.params.tweet_id,
  });
  res.sendStatus(200);
};

const unlikeTweet = (req, res) => {
  const user = helpers.getUser(req);
  model.Like.destroy({
    where: {
      userId: user.id,
      tweetId: req.params.tweet_id,
    },
  });
  res.sendStatus(200);
};

const deleteTweet = (req, res) => {
  model.Tweet.destroy({
    where: {
      id: req.params.tweet_id,
    },
  });
  res.sendStatus(200);
};

module.exports = {
  addTweet,
  getAllTweet,
  getTweetById,
  addReply,
  getAllReplies,
  likeTweet,
  unlikeTweet,
  deleteTweet,
};
