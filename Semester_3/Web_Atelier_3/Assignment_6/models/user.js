const mongoose = require('mongoose');

const { Schema } = mongoose;

const FavoriteSchema = require('./favorites').schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  registratedAt: { type: Date, default: new Date() },
  bookmarked: { type: [FavoriteSchema], default: [] },
});

mongoose.model('User', userSchema);

module.exports = userSchema;
