'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate(models) {
      Like.belongsTo(models.User);
      Like.belongsTo(models.Tweet);
    }
  }
  Like.init(
    {
      userId: DataTypes.INTEGER,
      tweetId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Like',
      tableName: 'Likes',
    }
  );
  return Like;
};
