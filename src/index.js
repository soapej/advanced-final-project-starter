// dotenv allows us to declare environment variables in a .env file, \
// find out more here https://github.com/motdotla/dotenv
/* eslint linebreak-style: ["error", "windows"]*/
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");

// Require custom strategies
require('./services/passport');

mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost/todo-list-app")
  .then(() => console.log("[mongoose] Connected to MongoDB"))
  .catch(() => console.log("[mongoose] Error connecting to MongoDB"));

const app = express();

const authenticationRoutes = require("./routes/AuthenticationRoutes");

app.use(bodyParser.json());
app.use(authenticationRoutes);

const authStrategy = passport.authenticate('authStrategy', { session: false });

app.get('/api/secret', authStrategy, function (req, res, next) {
  res.send(`The current user is ${req.user.username}`);
});


const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Listening on port:${port}`);
});
