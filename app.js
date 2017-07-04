var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('cookie-session');
var passport = require('passport');

var app = express();
app.io = require('socket.io')();

// Router
var index = require('./routes/index');

var env = process.env.NODE_ENV || 'production'
  , config = require('./config/config')[env]
  , auth = require('./config/middlewares/authorization')
  , mongoose = require('mongoose')
  , flash = require('connect-flash');


// mongoose
mongoose.Promise = global.Promise;
var db = mongoose.connect(config.db);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// configure session
app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: config.secret,
    cookie: { maxAge: 60000 }
}));
app.use(flash());

// use passport session
app.use(passport.initialize());
app.use(passport.session());

// passport configuration
require('./config/passport');

// Helpers
app.use(function(req,res,next){
	req.session.user = req.isAuthenticated() ? req.user : '';
    res.locals.session = req.session;
    res.locals.sessFlash = req.flash('message');
    // console.log(req.session);

    //Pagination Helper
    res.locals.createPagination = function (pages, page) {
      var url = require('url')
        , qs = require('querystring')
        , params = qs.parse(url.parse(req.url).query)
        , str = ''

      params.page = 0
      var clas = page == 0 ? "active" : "no"
      str += '<li class="'+clas+'"><a href="?'+qs.stringify(params)+'">First</a></li>'
      for (var p = 1; p < pages; p++) {
        params.page = p
        clas = page == p ? "active" : "no"
        str += '<li class="'+clas+'"><a href="?'+qs.stringify(params)+'">'+ p +'</a></li>'
      }
      params.page = --p
      clas = page == params.page ? "active" : "no"
      str += '<li class="'+clas+'"><a href="?'+qs.stringify(params)+'">Last</a></li>'

      return str
    }
    next();
});

// URL's
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
