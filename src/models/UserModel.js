/* eslint linebreak-style: ["error", "windows"]*/
/* eslint-env es6*/


const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    lowercase: true,
    required: true
  },

  password: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('User', userSchema);
