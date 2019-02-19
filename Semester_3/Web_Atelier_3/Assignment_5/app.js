// configure app


const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const kleiDust = require('klei-dust');
const ObservableArray = require('./assets/array');
// const dustHelpers = require('dustjs-helpers');
// const methodOverride = require('method-override');


const app = express();

app.use(logger('dev'));

kleiDust.setOptions({ useHelpers: true });
app.set('views', `${__dirname}/views`);
app.engine('dust', kleiDust.dust);
app.set('view engine', 'dust');

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', express.static('public'));

// Initialize routers here
const routers = require('./routes/routers');

app.locals.storage = new ObservableArray();

app.locals.storage.registerHandler(['onPush', 'onModify', 'onRemove'], function () {
  this.saveStorage();
});

app.use((req, res, next) => {
  req.storage = app.locals.storage;
  next();
});

app.use('/', routers.root);

app.use('/favorites', routers.favorites);

app.use('/bookmarked', routers.bookmarked);

module.exports = app;
