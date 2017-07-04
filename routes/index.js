var express = require('express');
var router = express.Router();
var path = require('path');
var passport = require('passport');

var resourcePath = path.join(__dirname, '..', 'app/views/');
var userCtl = require(path.join(resourcePath, '../users/controllers/users'));
var auth = require(path.join(resourcePath, '../../config/middlewares/authorization'));
var auctionCtl = require(path.join(resourcePath, '../auctions/controllers/auctions'));

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
router.post('/login', userCtl.authenticate);
router.get('/logout', userCtl.logout);

// Auction URL
router.get('/auction/add', auth.requiresLogin, auctionCtl.add);
router.post('/auction/create', auth.requiresLogin, auctionCtl.create);
router.get('/auction', auth.requiresLogin, auctionCtl.list);
router.get('/auction/:id', auth.requiresLogin, auctionCtl.show);

module.exports = router;
