var express = require('express');
var router = express.Router();
var passport = require('passport');
var ensureLoggedIn  =  require('connect-ensure-login').ensureLoggedIn();

/* GET users listing. * /
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.put('/', function (req, res, next) {
  res.send('Got a put request at /user');
});
router.delete('/', function(req, res, next){
  res.send('Got a delete request at /user');
}); */

// Get the user profile
router.get('/', ensureLoggedIn, function (req, res) {
  res.render('user',  { user: req.user});
});

module.exports = router;
