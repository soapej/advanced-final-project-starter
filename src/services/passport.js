/* eslint linebreak-style: ["error", "windows"]*/
/* eslint-env es6*/

const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/UserModel');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local');


const signinStrategy = new LocalStrategy(function (username, password, done) {
  User.findOne({ username: username }).exec()
    .then(user => {
      // If not found call done w/ null arg, saying no error
      // and 'false' saying the signin failed
      if (!user) {
        return done(null, false);
      }

      bcrypt.compare(password, user.password, function (err, isMatch) {
        // If there's an error call done w/ it
        if (err) {
          return done(err, false);
        }

        // If passwords don't match call done w/ null arg
        // and 'fasle' saying signin failed
        if (!isMatch) {
          return done(null, false);
        }

        // If no erros and passwords match call done
        // with null arg, saying no error
        // and with the now signed in user
        return done(null, user);
      });
    })
    .catch(err => done(err, false));
});

// Setup options for JwtStrategy
const jwtOptions = {
  // Get secret from environment
  secretOrKey: process.env.SECRET,
  // Tell strategy where to find token in request
  jwtFromRequest: ExtractJwt.fromHeaer('authorization')
};

// Create JWT Strategy
// This will take token and decode it to extract info
const authStrategy = new JwtStrategy(jjwtOptions, function (payload, done) {
  User.findById(payload.userId, function (err, user) {
    if (err) { return done(err, false); }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

// Tell passport to use this Strategy
passport.use('authStrategy', authStrategy);
passport.use('signinStrategy', signinStrategy);
