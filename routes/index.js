var express = require('express');
var router = express.Router();
var path = require('path');
var passport = require('passport');

var resourcePath = path.join(__dirname, '..', 'app/views/');
var userCtl = require(path.join(resourcePath, '../users/controllers/users'));
var auth = require(path.join(resourcePath, '../../config/middlewares/authorization'));

/* GET home page. */
router.get('/', function(req, res, next) {
	// console.log(req.user);
	req.session.user = req.user;
	res.locals.user = req.isAuthenticated() ? req.user : '';

	if(req.isAuthenticated()){
		res.redirect('/auction');
	}
  res.render(resourcePath + 'index', {});
});

// User URL
router.get('/register', userCtl.registration);
router.post('/register', userCtl.create);
router.get('/login', userCtl.login);
router.post('/login', passport.authenticate('local'), userCtl.authenticate);
router.get('/logout', userCtl.logout);

module.exports = router;
