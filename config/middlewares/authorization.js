/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function (req, res, next) {
  if (!req.isAuthenticated()) {
	  req.session.redirectUrl=null;
    return res.redirect('/login');
  }
  next();
};