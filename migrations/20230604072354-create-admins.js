'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('Admins', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      name: {
        unique: true,
        type: Sequelize.STRING,
      },
      account: {
        unique: true,
        type: Sequelize.STRING,
      },
      avatar: {
        type: Sequelize.STRING,
      },
      introduction: {
        type: Sequelize.TEXT,
      },
      role: {
        type: Sequelize.STRING,
        defaultValue: 'admin',
      },
      refreshToken: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('Admins')
  },
}
