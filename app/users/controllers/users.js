var User = require('../models/users');
var passport = require('passport');

var env = process.env.NODE_ENV || 'production';

var config = require('../../../config/config')[env];
var rootPath = config.root;

// Registration
exports.registration = function(req, res){
	res.render(rootPath+'/app/users/views/register', {});
};


exports.create = function(req, res, next) {
    var user = new User();  // create a new instance of the User Model
    user.name = req.body.name || ''; // set the users name (comes from the request)
    user.username = req.body.username;
	user.password = req.body.password;
    user.admin  = req.body.admin || false;
    
    // console.log(req.body)
    // save the user and check for errors
    User.register(user, req.body.password, function(err, new_user){
    	if (err){
    		console.log(err);
    		return next(err);
    		// return res.render(rootPath+'/views/users/register', {user: new_user});
    	}

    	passport.authenticate('local')(req, res, function(){
            res.format({
                html: function(){
                    res.redirect('/auction');
                },
                json: function(){
                    res.status(201).json({
                        "message": "Registration successful.",
                        "redirect_url": "/auction"
                    });
                }
            });
    		
    	});
    });
};

// Login
exports.login = function(req, res){
	res.render(rootPath+'/app/users/views/login', {});
};

exports.authenticate = function(req, res, next){

    passport.authenticate('local', function(err, user, info) {
        // console.log(info);
      if (err) {
        console.log(err);
        return next(err); // will generate a 500 error
      }
      if (!user) {
        req.flash("message", "<s>Username or password not matched.</s>");
        return res.redirect('/login');
      }
      req.login(user, function(err){
        if(err){
          console.log(err);
          return next(err);
        }
        return res.redirect('/auction');
      });
    })(req, res, next);
};

// Logout
exports.logout = function(req, res){
	req.logout();
	res.format({
        html: function(){
            res.redirect('/');
        },
        json: function(){
            res.status(200).json({
                "message": "Logout successful.",
                "redirect_url": "/auction"
            });
        }
    });
};