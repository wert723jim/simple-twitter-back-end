'use strict'
const { Tweet, User } = require('../models')
const axios = require('axios')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const insertAry = []
    const tweets = await Tweet.findAll({
      attributes: ['id'],
    })
    const users = await User.findAll({
      attributes: ['id'],
      order: Sequelize.literal('rand()'),
    })

    for (let tweet of tweets) {
      const userIdAry = (() => {
        const userIdAry = []
        while (userIdAry.length < 3) {
          const id = users[Math.floor(Math.random() * 5)].id
          if (!userIdAry.includes(id)) {
            userIdAry.push(id)
          }
        }
        return userIdAry
      })()
      for (let UserId of userIdAry) {
        const res = await axios.get(
          'https://textgen.cqd.tw?format=plain&size=10'
        )
        const comment = await res.data.trim()
        insertAry.push({
          UserId,
          TweetId: tweet.id,
          comment,
        })
      }
    }
    await queryInterface.bulkInsert('Replies', insertAry)
  },

  async down(queryInterface, Sequelize) {
    const { sequelize } = queryInterface
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
    await queryInterface.bulkDelete('Replies', null, { force: true })
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })
  },
}
