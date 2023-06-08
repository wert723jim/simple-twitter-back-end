'use strict'
const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Admins', [
      {
        account: 'root',
        name: 'root',
        email: 'root@example.com',
        password: await bcrypt.hash('12345678', 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])

    await queryInterface.bulkInsert('Users', [
      {
        account: 'user1',
        name: 'user1',
        email: 'user1@example.com',
        password: await bcrypt.hash('12345678', 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        account: 'user2',
        name: 'user2',
        email: 'user2@example.com',
        password: await bcrypt.hash('12345678', 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        account: 'user3',
        name: 'user3',
        email: 'user3@example.com',
        password: await bcrypt.hash('12345678', 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        account: 'user4',
        name: 'user4',
        email: 'user4@example.com',
        password: await bcrypt.hash('12345678', 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        account: 'user5',
        name: 'user5',
        email: 'user5@example.com',
        password: await bcrypt.hash('12345678', 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    const { sequelize } = queryInterface
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
    await queryInterface.bulkDelete('Admins', null, {})
    await queryInterface.bulkDelete('Users', null, {})
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })
  },
}
