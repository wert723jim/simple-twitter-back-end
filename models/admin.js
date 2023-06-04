'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {}

  Admin.init(
    {
      // Model attributes are defined here
      account: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      name: DataTypes.STRING,
      avatar: DataTypes.STRING,
      introduction: DataTypes.TEXT,
      refreshToken: DataTypes.STRING,
      // cover: DataTypes.STRING,
      role: {
        type: DataTypes.STRING,
        defaultValue: 'admin',
      },
      //   googleId: DataTypes.STRING,
      //   facebookId: DataTypes.STRING,
      // followingCount: DataTypes.INTEGER,
    },
    {
      // Other model options go here
      sequelize, // We need to pass the connection instance
      modelName: 'Admin', // We need to choose the model name
      tableName: 'Admins',
      // underscored: true,
    }
  )
  return Admin
}
