const express = require('express');
const helpers = require('./_helpers');
const app = express();
// 測試 models 內的檔案是否有正常運作，有問題會報錯
const db = require('./models')
const port = 3000

// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next) {
  // passport.authenticate('jwt', { ses...
}
// app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// route
app.use('/api', require('./routes/api'));

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;
