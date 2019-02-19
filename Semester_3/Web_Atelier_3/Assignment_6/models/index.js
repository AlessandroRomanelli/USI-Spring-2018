const mongoose = require('mongoose');
require('./favorites');
require('./user');

module.exports = {
  Favorites: mongoose.model('Favorites'),
  Users: mongoose.model('User'),
};
