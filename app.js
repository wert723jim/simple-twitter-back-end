const express = require('express');
const helpers = require('./_helpers');
const app = express();

// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next) {
  // passport.authenticate('jwt', { ses...
}
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// route
app.use('/api', require('./routes/api'));

app.get('/', (req, res) => res.send('Hello World!'));

module.exports = app;
