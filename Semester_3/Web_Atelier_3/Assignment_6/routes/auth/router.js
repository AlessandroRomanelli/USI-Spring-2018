const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport');

const saltRounds = 10;


const User = mongoose.model('User');

router.post('/signup', (req, res) => {
  User.find({ username: req.body.username }).then((data) => {
    console.log(data);
    if (data.length === 0 && req.body.password === req.body.confirmPassword) {
      bcrypt.hash(req.body.password, saltRounds)
        .then(hash => User.create({ username: req.body.username, password: hash }))
        .then((saved) => {
          console.log(saved);
          res.redirect('/auth');
        }).catch((err) => {
          console.error(err);
          throw err;
        });
    } else {
      res.status(400).end();
    }
  });
});

router.post('/', passport.authenticate('local'), (req, res) => {
  res.redirect('/');
});

router.get('/signup', (req, res) => {
  res.render('signup.dust');
});

router.get('/', (req, res) => {
  res.render('login.dust');
});

module.exports = router;
