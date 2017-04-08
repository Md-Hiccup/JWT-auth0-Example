/* We saw how we could download dependencies via npm. To use those dependencies in our code we require them.
   The syntax to require a library is the keyword require and a string for the name of the library.
   We assign this require function to a variable and can then access methods from the library through that variable.
   Here we are requiring all of our dependencies at the top of the page as is good practice.    */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var dotenv = require('dotenv');

// Passport is the most popular Node Js authentication library
var passport = require('passport');
// We are including the Auth0 authentication strategy for Passport
var Auth0Strategy = require('passport-auth0');

/* We are using the dotenv library to load our environmental variables from the .env file.
   We don't have anything in the .env file for now, but we will soon.     */
dotenv.load();

/* var Auth0Lock = require('auth0-lock');
var clientId = 'GU9XEvDBlREFE6T5VNbHh9gAeCkAclZK';
var domain = 'ask2md.auth0.com';
// Instantiate Lock - without custom options
var lock = new Auth0Lock(clientId, domain);
// Listening for the authenticated event
lock.on("authenticated", function(authResult) {
  // Use the token in authResult to getUserInfo() and save it to localStorage
  lock.getUserInfo(authResult.accessToken, function(error, profile) {
    if (error) {
      // Handle error
      return;
    }

    localStorage.setItem('accessToken', authResult.accessToken);
    localStorage.setItem('profile', JSON.stringify(profile));
  });
});
*/

/* Just like external libraries, we can import our application code using the require function.
   The major difference is that we have to give the exact path to our file.
   We saw in the directory structure section that we will have an index.js file in a routes directory.
   Go ahead and create it if you haven't already, otherwise you'll get errors when compiling the code.      */
var index = require('./routes/index');
//var user = require('./routes/users');
/* This line of code instantiates the Express JS framework.
   We assign it to a variable called app, and will add our configruation to this variable. */
var app = express();

/* The .set method allows us to configure various options with the Express framework.
   Here we are setting our views directory as well as telling Express that our templating engine will be ejs .More on that soon. */
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// We are also adding passport to our middleware flow
app.use(passport.initialize());
app.use(passport.session());

/* The .use method is similar to the .set method, where it allows us to set further configurations.
   The .use method also acts as a chain of events that will take place once a request hits our Node Js application.
   First we'll log the request data, parse any incoming data, and so on.        */
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  // Here we are creating a unique session identifier
  secret: 'shhhhhhhhh',
  resave: true,
  saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
//app.use('/users', user);


// Configure Passport to use Auth0
var strategy = new Auth0Strategy({
  domain:      process.env.AUTH0_DOMAIN,
  clientID:    process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  callbackURL:  process.env.AUTH0_CALLBACK_URL
}, function(accessToken, refreshToken, extraParams, profile, done){
  // accessToken is the token to call AUTH0 API (not needed in the most cases)
  // extraParams.id_token has the JSON Web Token
  // profile has all the information from the user
  return done(null, profile);
});
// Here we are adding the Auth0 Strategy to our passport framework
passport.use(strategy);

// The searlize and deserialize user methods will allow us to get the user data once they are logged in.
//  This can be used to keep a smaller payload
passport.serializeUser(function(user, done){
  done(null, user);
});
passport.deserializeUser(function(user, done){
  done(null, user);
});



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
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  //res.send(err)
  res.render('error', {
    message: err.message,
    error: err
  });
});
/* Finally, we'll choose to have our app listen on port 3000.
 This means that once we launch our app, we'll be able to navigate to localhost:3000 and see our app in action.
 You are free to choose any port you want, so 8080, or 80, or really any number will work.
 The reason 3000 is typically used is because it's the lowest port number that can be used without requiring elevated privileges on Mac/Linux systems.  */
// server running on port 3000
app.listen('3005', function(){
  console.log("server running on port : 3005");
});

module.exports = app;
