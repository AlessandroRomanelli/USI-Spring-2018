// configure app


const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const kleiDust = require('klei-dust');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
require('./models/favorites');
require('./models/user');
const config = require('./config');

const app = express();

mongoose.connect(config.mongoUrl + config.mongoDbName);

app.use(logger('dev'));

kleiDust.setOptions({ useHelpers: true });
app.set('views', `${__dirname}/views`);
app.engine('dust', kleiDust.dust);
app.set('view engine', 'dust');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', express.static('public'));
app.use(passport.initialize());
app.use(passport.session());

require('./auth')();

// Initialize routers here
const routers = require('./routes/routers');

app.use('/', routers.root);

app.use('/:userid/favorites', (req, res, next) => {
  req.userID = req.params.userid;
  next();
});

app.use('/favorites', routers.favorites);

app.use('/:userid/favorites', routers.favorites);

app.use('/bookmarked', routers.bookmarked);

app.use('/auth', routers.auth);

app.get('/auth/logout', (req, res) => {
  req.logout();
  res.redirect('back');
});

module.exports = app;
