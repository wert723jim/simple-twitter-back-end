// 'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Reply);
      User.hasMany(models.Tweet);
      User.hasMany(models.Like);
      User.belongsToMany(models.User, {
        through: models.Followship,
        foreignKey: 'followerId',
        as: 'followerId',
      });
      User.belongsToMany(models.User, {
        through: models.Followship,
        foreignKey: 'followingId',
        as: 'followingId',
      });
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
      underScored: true,
    }
  );
  // const User = sequelize.define(
  //   'User',
  //   {
  //     id: {
  //       allowNull: false,
  //       autoIncrement: true,
  //       primaryKey: true,
  //       type: DataTypes.INTEGER,
  //     },
  //     email: {
  //       type: DataTypes.STRING,
  //     },
  //     password: {
  //       type: DataTypes.STRING,
  //     },
  //     name: {
  //       type: DataTypes.STRING,
  //     },
  //     account: {
  //       type: DataTypes.STRING,
  //     },
  //     avatar: {
  //       type: DataTypes.STRING,
  //     },
  //     introduction: {
  //       type: DataTypes.TEXT,
  //     },
  //     role: {
  //       type: DataTypes.STRING,
  //     },
  //     createdAt: {
  //       allowNull: false,
  //       type: DataTypes.DATE,
  //     },
  //     updatedAt: {
  //       allowNull: false,
  //       type: DataTypes.DATE,
  //     },
  //   },
  //   {}
  // );
  // User.associate = function (models) {
  //   User.hasMany(models.Reply);
  //   User.hasMany(models.Tweet);
  //   User.hasMany(models.Like);
  //   User.belongsToMany(models.User, {
  //     through: models.Followship,
  //     foreignKey: 'followerId',
  //     as: 'followerId',
  //   });
  //   User.belongsToMany(models.User, {
  //     through: models.Followship,
  //     foreignKey: 'followingId',
  //     as: 'followingId',
  //   });
  // };
  return User;
};

'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Tweet, {
        foreignKey: 'UserId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      User.belongsToMany(User, {
        through: models.Followship,
        foreignKey: 'followingId',
        as: 'Followers',
      });
      User.belongsToMany(User, {
        through: models.Followship,
        foreignKey: 'followerId',
        as: 'Followings',
      });
      User.hasMany(models.Like, {
        foreignKey: 'UserId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      User.hasMany(models.Reply, {
        foreignKey: 'UserId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  User.init(
    {
      // Model attributes are defined here
      account: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      name: DataTypes.STRING,
      avatar: DataTypes.STRING,
      introduction: DataTypes.TEXT,
      cover: DataTypes.STRING,
      role: DataTypes.STRING,
      followingCount: DataTypes.INTEGER,
    },
    {
      // Other model options go here
      sequelize, // We need to pass the connection instance
      modelName: 'User', // We need to choose the model name
      tableName: 'Users',
      underscored: true,
      timestamps: true,
    }
  );
  return User;
};
