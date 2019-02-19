const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  const { bookmarked } = req.storage;
  if (req.accepts('html')) {
    res.set('Content-Type', 'text/html');
    res.render('favorites.dust', { storage: bookmarked });
  } else if (req.accepts('json')) {
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(bookmarked));
  } else {
    res.status(406).end();
  }
});

module.exports = router;
