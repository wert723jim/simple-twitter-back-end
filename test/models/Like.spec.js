const chai = require('chai')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
chai.use(require('sinon-chai'))

const { expect } = require('chai')
const { sequelize, Sequelize } = require('sequelize-test-helpers')

const db = require('../../models')

describe('# Like Model', () => {
  // 取出 Sequelize 的 DataTypes
  const { DataTypes } = Sequelize
  // 將 models/like 中的 sequelize 取代成這裡的 Sequelize
  const LikeFactory = proxyquire('../../models/like', {
    sequelize: Sequelize,
  })
  // const UserFactory = proxyquire('../../models/user', {
  //   sequelize: Sequelize,
  // })
  // const TweetFactory = proxyquire('../../models/tweet', {
  //   sequelize: Sequelize,
  // })

  // 宣告 Like 變數
  let Like
  // let User
  // let Tweet

  before(() => {
    // 賦予 Like 值，成為 Like Model 的 instance
    Like = LikeFactory(sequelize, DataTypes)
    // User = UserFactory(sequelize, DataTypes)
    // Tweet = TweetFactory(sequelize, DataTypes)
  })

  // 清除 init 過的資料
  after(() => {
    Like.init.resetHistory()
  })

  // 檢查 like 是否有 UserId, TweetId 屬性，自動化測試會用到
  it('called Like.init with the correct parameters', () => {
    expect(Like.init).to.have.been.calledWithMatch({
      UserId: DataTypes.INTEGER,
      TweetId: DataTypes.INTEGER,
    })
  })

  // 檢查 like 的關聯是否正確
  context('associations', () => {
    const User = 'User'
    const Tweet = 'Tweet'
    before(() => {
      // 將 Like model 對 User, Tweet 做關聯(呼叫 associate)
      Like.associate({ User })
      Like.associate({ Tweet })
    })

    it('should belong to user', (done) => {
      // 檢查是否有呼叫 belongsTo(User)
      expect(Like.belongsTo).to.have.been.calledWith(User)
      done()
    })
    it('should belong to tweet', (done) => {
      // 檢查是否有呼叫 belongsTo(Tweet)
      expect(Like.belongsTo).to.have.been.calledWith(Tweet)
      done()
    })
  })

  // 檢查 model 的新增、修改、刪除、更新
  context('action', () => {
    let data = null
    let UserId
    let TweetId

    before(async () => {
      // 清除測試資料庫資料
      await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, {
        raw: true,
      })
      const res = await db.User.create({})
      UserId = res.id
      const tRes = await db.Tweet.create({ UserId })
      TweetId = tRes.id
      await db.Like.destroy({ where: {}, truncate: true, force: true })
      await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, {
        raw: true,
      })
    })

    // 檢查 db.Like 是否真的可以新增一筆資料
    it('create', (done) => {
      db.Like.create({
        UserId,
        TweetId,
      }).then((like) => {
        data = like
        done()
      })
    })
    // 檢查 db.Like 是否真的可以讀取一筆資料
    it('read', (done) => {
      db.Like.findByPk(data.id).then((like) => {
        expect(data.id).to.be.equal(like.id)
        done()
      })
    })
    // 檢查 db.Like 是否真的可以更新一筆資料
    it('update', (done) => {
      db.Like.update({}, { where: { id: data.id } }).then(() => {
        db.Like.findByPk(data.id).then((like) => {
          expect(data.updatedAt).to.be.not.equal(like.updatedAt)
          done()
        })
      })
    })
    // 檢查 db.Like 是否真的可以刪除一筆資料
    it('delete', (done) => {
      db.Like.destroy({ where: { id: data.id } }).then(() => {
        db.Like.findByPk(data.id).then((like) => {
          expect(like).to.be.equal(null)
          done()
        })
      })
    })

    after(async () => {
      // 清除測試資料庫資料
      await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, {
        raw: true,
      })
      await db.User.destroy({ where: {}, truncate: true, force: true })
      await db.Tweet.destroy({ where: {}, truncate: true, force: true })
      await db.Like.destroy({ where: {}, truncate: true, force: true })
      await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, {
        raw: true,
      })
    })
  })
})
