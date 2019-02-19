const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');

const Favorite = mongoose.model('Favorites');

const { sendResponse, addSelfReference } = require('../../utils');


router.get('/', (req, res) => {
  Favorite.find({ bookmarked: true }).then((bookmarked) => {
    const results = addSelfReference(bookmarked);
    sendResponse(req, res, results, false, 'favorites.dust');
  });
});

module.exports = router;
