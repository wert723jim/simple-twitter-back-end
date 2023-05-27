const User = require('../models')['User']
const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')

// 判斷是否可以搬到userController

const addNewUser = async (req, res, next) => {
  // check if column is empty
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: '請求錯誤' })
  }
  const requireField = {
    account: '帳號',
    name: '名稱',
    email: '信箱',
    password: '密碼',
    checkPassword: '確認密碼',
  }
  for (let field in requireField) {
    if (!Object.keys(req.body).includes(field) || !req.body[field]) {
      return res.status(400).json({ message: `${field}不能為空` })
    }
  }

  // check email format
  const regex =
    /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
  if (!regex.test(req.body.email)) {
    return res.status(400).json({ message: '信箱格式有誤' })
  }

  // check password equal
  if (req.body.password !== req.body.checkPassword) {
    return res.status(400).json({ message: '確認密碼有誤' })
  }

  // check duplicate
  const dupUser = await User.findAll({
    where: {
      [Op.or]: [{ account: req.body.account }, { name: req.body.name }],
    },
  })
  if (dupUser.length > 0) {
    return res.status(400).json({ message: '帳號或名稱重複' })
  }

  // hash password
  const hashPassword = await bcrypt.hash(req.body.password, 10)

  // create user
  try {
    await User.create({
      account: req.body.account,
      name: req.body.name,
      email: req.body.email,
      password: hashPassword,
    })
    return res.sendStatus(200)
  } catch (error) {
    return res.status(507).json({ message: '資料庫請求錯誤', error })
  }
}

module.exports = { addNewUser }
