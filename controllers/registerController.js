const User = require('../models')['User'];
const bcrypt = require('bcryptjs')

const addNewUser = (req, res, next) => {
  // check if column is empty 
  if (!req.body.account || !req.body.name || !req.body.email || !req.body.password || !req.body.checkPassword) throw new Error("Column can't be empty")
  // TODO checkpassword equal
  if (req.body.password !== req.body.checkPassword) throw new Error('Password do not match')
  // check if email already exist
  // TODO check data duplicate
  User.findOne({ where: { email: req.body.email }})
    .then(user => {
      if (user) throw new Error('Email already exist.')
      // TODO hash password
      return bcrypt.hash(req.body.password, 10)
    })
    .then(hash => User.create({
      account: req.body.account,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    }))
    // success
    .then(() => {
      res.sendStatus(200);
    })
    // error handle
    .catch(err => next(err))
  
  // 判斷是否可以搬到userController
  // const password = req.body.password;
  
};

module.exports = { addNewUser };
