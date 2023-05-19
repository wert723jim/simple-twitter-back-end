const User = require('../models')['User'];

const addNewUser = (req, res) => {
  // TODO checkpassword equal
  // TODO hash password
  // TODO check data duplicate
  // 判斷是否可以搬到userController
  const password = req.body.password;
  User.create({
    account: req.body.account,
    name: req.body.name,
    email: req.body.email,
    password,
  });
  res.sendStatus(200);
};

module.exports = { addNewUser };
