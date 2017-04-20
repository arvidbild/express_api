'use strict';

// load modules
var express = require("express");
var morgan = require("morgan");
var pug = require("pug");
var bodyParser = require('body-parser')

var mongoose = require("mongoose");
var User = require("./models/User");
var Review = require("./models/Review");
var Course = require("./models/Course");
var seeder = require("mongoose-seeder");
var data = require("./data/data.json");

//Require our routes
var router = require("./routes/router");

var app = express();

/**
Connect to the database
**/
mongoose.connect('mongodb://localhost:27017/express_api');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));


db.once('open', function() {
  // we're connected!
//console.log(data);
    //seed the database with mongoose-seeder
    seeder.seed(data).then(function(){
        console.log("the data has been seeded");
    }).catch(function(err) {
    // handle error
        console.log(err);
    });
});



/*
Set up the app 
*/

// set our port
app.set('port', process.env.PORT || 5000);

app.set("view engine", "pug");
app.set("views", "./public/views");

// morgan gives us http request logging
app.use(morgan('dev'));

// setup our static route to serve files from the "public" folder
app.use('/', express.static('public'));

//using body-parser
app.use(bodyParser.json());

//setup our routes
app.use("/", router);


// catch 404 and forward to global error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// Express's global error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// start listening on our port
var server = app.listen(app.get('port'), function() {
  console.log('Express server is listening on port ' + server.address().port);
});


