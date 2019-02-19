const express = require('express');

const router = express.Router();
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const { sendResponse, addSelfReference } = require('../../utils');


const Favorite = mongoose.model('Favorites');

const validFormData = req => req.body && typeof req.body === 'object';

router.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    if (!(req.is('json') || req.is('multipart/form-data') || req.is('application/x-www-form-urlencoded'))) {
      res.status(400).end();
      return;
    }
  }
  next();
});

router.use(methodOverride((req) => {
  let method = {};
  if (validFormData(req) && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    method = req.body._method;
    delete req.body._method;
  }
  return method;
}));

router.use((req, res, next) => {
  if (!req.userID) {
    req.userID = 'anon';
  }
  next();
});

router.get('/search', (req, res) => {
  Favorite.find(req.query).then((data) => {
    const results = addSelfReference(data);
    sendResponse(req, res, results, false, 'favorites.dust');
  }).catch((err) => {
    console.error(err);
  });
});

router.put('/:favoriteid', (req, res) => {
  if (Object.keys(req.body).length === 0) { res.status(400).end(); return; }
  Favorite.findByIdAndUpdate(req.params.favoriteid, req.body, { upsert: true })
    .then((data) => {
      const saved = addSelfReference(data);
      sendResponse(req, res, saved);
    }).catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).end();
      }
      res.status(404).end();
    });
});

router.put('/:favoriteid/bookmarked', (req, res) => {
  if (!req.params.favoriteid) { res.status(400).end(); }
  Favorite.findById(req.params.favoriteid)
    .then((result) => {
      if (result === null) {
        res.status(404).end();
        throw new Error(`No favorite found with ID:${req.params.favoriteid}`);
      }
      result.bookmarked = !result.bookmarked;
      return result.save();
    }).then((data) => {
      const result = addSelfReference(data);
      sendResponse(req, res, result);
    }).catch((err) => {
      console.error(err);
      res.status(404).end();
    });
});


router.delete('/:favoriteid', (req, res) => {
  Favorite.findByIdAndDelete(req.params.favoriteid)
    .then((removed) => {
      if (removed === null) { res.status(404).end(); return; }
      sendResponse(req, res, removed);
    }).catch((err) => {
      console.error(err);
      throw err;
    });
});

router.get('/:favoriteid', (req, res) => {
  Favorite.findById(req.params.favoriteid).then((data) => {
    if (data !== null) {
      const result = addSelfReference(data);
      sendResponse(req, res, result, false, 'favorites.dust');
    } else {
      res.status(404).end();
    }
  }).catch((err) => {
    console.error(err);
    res.status(404).end();
  });
});

router.delete('/', (req, res) => {
  if (req.user) {
    Favorite.deleteMany({ user: req.user.username }).then(() => {
      res.status(200).end();
    }).catch((err) => { console.error(err); throw err; });
  } else {
    res.status(404).end();
  }
});


router.post('/', (req, res) => {
  if (req.user) { req.body.user = req.user.username; }
  if (req.body.user === '') { delete req.body.user; }
  Favorite.create(req.body).then((saved) => {
    const result = addSelfReference(saved);
    res.status(201);
    sendResponse(req, res, result);
  }).catch((err) => {
    console.error(err);
    res.status(400).end();
  });
});

router.get('/', (req, res) => {
  const query = { user: req.userID };
  // const query = (req.userID === 'anon') ? {} : { user: req.userID };
  Favorite.find(query).then((data) => {
    const results = addSelfReference(data);
    sendResponse(req, res, results, false, 'favorites.dust');
  }).catch((err) => {
    console.error(err);
  });
});

module.exports = router;
