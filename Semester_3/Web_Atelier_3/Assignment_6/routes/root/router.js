const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const { sendResponse, addSelfReference } = require('../../utils');

const Favorite = mongoose.model('Favorites');


router.get('/', (req, res) => {
  Favorite.find({}).then((data) => {
    const results = addSelfReference(data);
    sendResponse(req, res, results, false, 'index.dust');
  }).catch(err => console.error(err));
});

module.exports = router;
