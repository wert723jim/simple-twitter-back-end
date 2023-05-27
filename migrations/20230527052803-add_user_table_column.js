'use strict'
const { sequelize } = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'googleId', {
      type: Sequelize.STRING,
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'googleId')
  },
}
