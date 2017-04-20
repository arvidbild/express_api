"use strict"


//Get the basic auth credentials from the given request. The Authorization header is parsed and if the header is invalid, undefined is returned, otherwise an object with name and pass properties.
var auth = require('basic-auth');
var bcrypt = require("bcrypt");

var User = require("../models/User");

var  requireAuth = function (req,res,next) { 
    
    // define unauthorised error message
    var unauthorized = new Error('Unauthorized');
    unauthorized.status = (401);

var credentials = auth(req);    

    if (credentials && credentials.name && credentials.pass) {
    
    // attepmpt to grab the user account from database
    User.findOne({ emailAddress: credentials.name })
        .exec(function (err, user) {
            if (err || !user) return next(unauthorized);
          
            // if found, check for a password match
            bcrypt.compare(credentials.pass, user.hashedPassword, function (err, check) {
            
                if (check) { // Attach the user id to the request and continue
                    req.userId = user._id;
                    return next();
                }

                return next(unauthorized);
            });
        });

    // no credentials in the authorization header
    } else {
        return next(unauthorized);
    }
}    
    

module.exports.requireAuth = requireAuth;