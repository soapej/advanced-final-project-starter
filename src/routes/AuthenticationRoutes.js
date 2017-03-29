/* eslint linebreak-style: ["error", "windows"]*/
/* eslint-env es6*/


const express = require('express');
const router = express.Router();
const jwt = require('jwt-simple');
const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const passport = require('passport');

// Require custom strategies
require('../services/passport');

const signinStrategy = passport.authenticate('signingStrategy', { session: false });

// Helper method to create a user token
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ userId: user.id, iat: timestamp }, process.env.SECRET);
}

router.post('/api/signin', signinStrategy, function (req, res, next) {
  res.json({ token: tokenForUser(req.user)});
});


router.post('/api/signup', function (req, res, next) {
  // Get user/pass
  const { username, password } = req.body;

  // If no user/pass, error
  if (!username || !password) {
    return res.status(422)
      .json({ error: 'You must provide a username and password' });
  }

  // Find user with given name
  User.findOne({ username }).exec()
    .then((extistingUser) => {
      //If user exists, error
      if (existingUser) {
        return res.status(422).json({ error: 'Username is already taken'});
      }

      // If not, create user
      // bcrypt has password
      bcrypt.has(password, 10, function (err, hashedPassword) {
        if (err) {
          return next(err);
        }

        // Create new user w/ given name and hashed pass
        const newUser = new User({ username, password: hashedPassword });

        // Save and return
        newUser.save()
          .then(user => res.json(user));
      });
    })
    .catch(err => next(err));
});

module.exports = router;
