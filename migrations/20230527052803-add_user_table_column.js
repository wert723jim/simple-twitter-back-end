'use strict'
const { sequelize } = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('users', 'googleId', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('users', 'facebookId', {
        type: Sequelize.STRING,
      }),
    ])
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('users', 'googleId'),
      queryInterface.removeColumn('users', 'facebookId'),
    ])
  },
}
