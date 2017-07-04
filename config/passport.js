var mongoose = require('mongoose')
  , LocalStrategy = require('passport-local').Strategy
  , passport = require('passport')
  , User = mongoose.model('User');


// passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());