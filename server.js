// =============================================================
// Node Dependencies
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var logger = require('morgan');
var request = require('request');
var cheerio = require('cheerio');

// Initialize Express for debugging and body parsing
var app = express();
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}))

// Serve Static Content
app.use(express.static(process.cwd() + '/public'));

// Express-Handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Tell server to use the middleware router.js in the "routes" directory to handle all requests
var router = require('./routes');
app.use('/', router);

// Now, start the server
// Listen either on the port Heroku gives us, or on 8080 if we are running on localhost. 
var PORT = process.env.PORT || 8080

// Start our app's listening on either port 8080 or the port that heroku gave us
app.listen(PORT, function() {
     console.log("app is listening on Port "+ PORT);
});