var express = require('express');
var router = express.Router();
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
var request = require('request');
//var Auth0Strategy = require('passport-auth0');

/* We are going to want to share some data between our server and UI, so we'll be sure to pass that data in an env variable.    */
var env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL: 'http://localhost:3005/callback'   // process.env.AUTH0_CALLBACK_URL
};

/* On our router variable, we'll be able to include various methods. For our app we'll only make use of GET requests,
  so the method router.get will handle that interaction. This method takes a string as its first parameter and that is the url path,
  so for the first route we are just giving it '/', which means the default route. Next we are defining a Node Js callback function,
  that takes three parameters, a request (req), a response (res), and an optional next (next) parameter.
  Finally, in our callback function, we are just send the message "You are on the homepage".
 */
//Calling next will exit the current function and move down the middleware stack.At the end of each function, you can either call next to go the next function in the stack,
/* GET home page. */
router.get('/', function(req, res, next) {
 // res.send("You are on the homepage");
  res.render('index', { env: env });
  //console.log(req.session);
  //console.log('===================');
  //console.log(req.cookies);
});
/*
router.post('/', function(req, res, next){
  res.send("Got a post request");
});*/

//  Render the login template
router.get('/login',  function(req, res){
  //res.send("You are on the login page");
  res.render('login', { env: env });
});

//  Preform session logout and redirect to homepage
router.get('/logout',  function (req, res){
  //res.send("You are on the logout page");
  req.logout();
  res.redirect('/');
});

router.get('/polls',  function (req, res) {
  //res.send("You are on the polls page");
/* You may have noticed that we included two new require files, one of them being request.
  Request allows us to easily make HTTP requests. In our instance here, we are using the Huffington Post's API to pull the latest
  election results, and then we're sending that data to our polls view. */
/* The second require was the connect-ensure-loggedin library, and from here we just required a method called ensureLoggedIn,
 which will check and see if the current user is logged in before rendering the page. If they are not,
 they will be redirected to the login page. We are doing this in a middleware pattern, we first call the ensureLoggedIn method,
  wait for the result of that action, and finally execute our /polls controller.  */
  request('http://elections.huffingtonpost.com/pollster/api/charts.json?topic=2016-president', function (error, response, body) {
    if(!error && response.statusCode == 200){
      var polls = JSON.parse(body);
      /* For this view, we are not only sending our environmental information, but the polls and user information as well.  */
      res.render('polls', {env: env, user: req.user, polls: polls});
    } else {
      res.render('error');
    }
  })
});

router.get('/user', ensureLoggedIn, function (req, res) {
  //res.send("You are on the user page");
  res.render('user' , { env:env ,user:rew.user});
});
// We are also going to implement the callback route which will redirect the logged in user to the polls page if authentication succeeds.
//  Perform the final stage of authentication and redirect to '/user'
router.get('/callback',
  passport.authenticate('auth0',  { failureRedirect:  '/' }),
  function (req, res) {
    res.redirect(req.session.returnTo || '/polls');
});

/* Finally, we export this module so that we can import it in our app.js file and gain access to the routes we defined  */
module.exports = router;
