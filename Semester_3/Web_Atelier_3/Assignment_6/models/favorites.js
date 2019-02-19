const mongoose = require('mongoose');

const { Schema } = mongoose;

const favoriteSchema = new Schema({
  // _id: { type: Schema.Types.ObjectId, required: true },
  user: { type: String, default: 'anon' },
  dataUrl: { type: String, required: true },
  title: { type: String, default: '', required: true },
  bookmarked: { type: Boolean, default: false },
  dateCreated: { type: Date, default: new Date() },
});

mongoose.model('Favorites', favoriteSchema);

module.exports = favoriteSchema;
