const express = require('express');

const router = express.Router();
const methodOverride = require('method-override');

const validFormData = req => req.body && typeof req.body === 'object';

router.use(methodOverride((req) => {
  let method = {};
  if (validFormData(req) && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    method = req.body._method;
    delete req.body._method;
  }
  return method;
}));

router.get('/search', (req, res) => {
  const matchingObjects = req.storage.find(req.query);
  if (req.accepts('html')) {
    res.set('Content-Type', 'text/html');
    res.render('favorites.dust', { storage: matchingObjects });
  } else if (req.accepts('json')) {
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(matchingObjects));
  } else {
    res.status(406).end();
  }
});

router.put('/:favoriteid', (req, res) => {
  const id = req.params.favoriteid;
  if (req.storage.contains(id)) {
    res.status(201);
  }
  if (validFormData(req)) {
    req.storage.modify(id, req.body);
    if (req.accepts('html')) {
      res.redirect('back');
    } else if (req.accepts('json')) {
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify(req.storage.array));
    } else {
      res.status(406).end();
    }
  } else {
    res.status(401).end();
  }
});

router.put('/:favoriteid/bookmarked', (req, res) => {
  const id = req.params.favoriteid;
  if (validFormData(req)) {
    if (!req.storage.contains(id)) {
      res.status(404).end();
    } else {
      const obj = req.storage.get(id);
      obj.bookmarked = !obj.bookmarked;
      if (req.accepts('html')) {
        res.redirect('back');
      } else if (req.accepts('json')) {
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(req.storage.array));
      } else {
        res.status(406).end();
      }
    }
  } else {
    res.status(400).end();
  }
});

router.delete('/:favoriteid', (req, res) => {
  const id = req.params.favoriteid;
  if (req.storage.contains(id)) {
    req.storage.remove(id);
    if (req.accepts('html')) {
      res.redirect('back');
    } else if (req.accepts('json')) {
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify(req.storage.array));
    } else {
      res.status(406).end();
    }
  } else {
    res.status(404).end();
  }
});

router.get('/:favoriteid', (req, res) => {
  const id = req.params.favoriteid;
  const obj = req.storage.get(id);
  if (obj) {
    if (req.accepts('html')) {
      res.set('Content-Type', 'text/html');
      res.render('favorites.dust', { storage: [obj] });
    } else if (req.accepts('json')) {
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify(obj));
    } else {
      res.status(406).end();
    }
  } else {
    res.status(404).end();
  }
});

router.post('/', (req, res) => {
  if (req.is('json') || req.is('multipart/form-data') || req.is('application/x-www-form-urlencoded')) {
    if (req.body.dataUrl && req.body.title) {
      if (!req.body.bookmarked) {
        req.body.bookmarked = false;
      }
      req.storage.push(req.body);
      res.status(201);
      if (req.accepts('html')) {
        res.redirect('back');
      } else if (req.accepts('json')) {
        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(req.body));
      } else {
        res.status(406).end();
      }
      return;
    }
  }
  res.status(400).end();
});

router.get('/', (req, res) => {
  if (req.accepts('html')) {
    res.set('Content-Type', 'text/html');
    res.render('favorites.dust', { storage: req.storage.array });
  } else if (req.accepts('json')) {
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(req.storage.array));
  } else {
    res.status(406).end();
  }
});

module.exports = router;
