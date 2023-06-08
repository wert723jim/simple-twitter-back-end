'use strict'
const axios = require('axios')
const User = require('../models')['User']

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const insertAry = []
    const users = await User.findAll({
      attributes: ['id'],
      limit: 5,
    })
    for (let user of users) {
      let tweetCount = 0
      while (tweetCount < 10) {
        const res = await axios.get(
          'https://textgen.cqd.tw?format=plain&size=140'
        )
        const description = await res.data.trim().slice(0, 140)
        insertAry.push({
          UserId: user.id,
          description,
        })
        tweetCount += 1
      }
    }

    await queryInterface.bulkInsert('Tweets', insertAry)
  },

  async down(queryInterface, Sequelize) {
    const { sequelize } = queryInterface
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
    await queryInterface.bulkDelete('Tweets', null, { force: true })
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })
  },
}
