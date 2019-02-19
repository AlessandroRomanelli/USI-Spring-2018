const passport = require('passport');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = mongoose.model('User');
const LocalStrategy = require('passport-local').Strategy;

function auth() {
  passport.use(new LocalStrategy(
    ((username, password, done) => {
      let userObject;
      User.findOne({ username }).exec().then((user) => {
        userObject = user;
        if (user === null) { return done(null, false, { message: 'Username does not exist' }); }
        return bcrypt.compare(password, user.password);
      }).then((isValidPassword) => {
        if (isValidPassword) {
          return done(null, userObject);
        }
        return done(null, false, { message: 'Incorrect Password' });
      })
        .catch((err) => { console.error(err); done(err); });
    }),
  ));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}

module.exports = auth;
