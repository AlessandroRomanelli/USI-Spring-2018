const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  if (req.accepts('html')) {
    res.set('Content-Type', 'text/html');
    res.render('index.dust', { storage: req.storage.array });
  } else if (req.accepts('json')) {
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(req.storage.array));
  } else {
    res.status(406).end();
  }
});

module.exports = router;
