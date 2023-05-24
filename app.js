const express = require('express');
const helpers = require('./_helpers');
const app = express();

// 測試 models 內的檔案是否有正常運作，有問題會報錯
const db = require('./models')
const port = 3000

const passport = require('./config/passport');

// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next) {
  // passport.authenticate('jwt', { ses...
}

app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

const path = require('path');
app.get('/test_login', (req, res) =>
  res.sendFile(path.join(__dirname, 'test_login.html'))
);
app.post(
  '/test_login',
  passport.authenticate('local', {
    session: false,
    failureRedirect: '/login_fail',
  }),
  (req, res) => {
    console.log('login success');
    res.send('login success');
  }
);

app.get('/login_fail', (req, res) => res.send('login fail'));

// route
app.use('/api', require('./routes/api'));

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;
