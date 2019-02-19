'use strict';

const express = require('express');
const router = express.Router();


router.get('/', function(req, res, next) {
  if(req.accepts('json')) {
    res.json({
      text: 'GET Working'
    })
  } else {
    res.status(200).end('GET Working')
  }
});

router.delete('/', function(req, res, next) {
  if(req.accepts('json')) {
    res.json({
      text: 'DELETE Working'
    })
  } else {
    res.status(201).end('DELETE Working')
  }
});

router.get('/redirect', function(req, res, next) {
  res.redirect('/tests/redirected')
});

router.get('/redirected', function(req, res, next) {
  res.status(200).end('Redirect Works')
});

router.post('/json', function(req, res, next) {
  if(req.accepts('json')) {
    res.type('json')
    res.status(200).json({
      text: 'POST Working',
      body: {test: 'test'}
    })
  } else {
    res.end('POST Working')
  }
});

router.put('/echo', function(req, res, next) {
  if(req.accepts('json')) {
    res.json({
      text: 'PUT Working',
      body: req.body
    })
  } else {
    res.end(req.body.test)
  }
});

module.exports = router;
