"use strict"

var mongoose = require("mongoose");
var bcrypt = require("bcrypt");

var Schema = mongoose.Schema;

var userSchema = new Schema ({

    fullName: {
        type: String,
    required: [true, "You have to provide a fullName"] 
    },
    
emailAddress: {
       type: String,
   required: [true, "You have to write an email"], 
     unique: [true, "Email belong to a existing user"] 
    },
    
    hashedPassword: {
        type: String,
        required: [true, "You have to write a password"]
    }    
});

//Hash the password before it is stored to the database. 
userSchema.pre("save", function(next){
    var user = this;
    
    bcrypt.hash(user.hashedPassword, 10, function(err, hash){
        
        if(err){
            return next(err);
        }
        user.hashedPassword = hash;
        return next();        
        });
});

//Models are fancy constructors compiled from our Schema definitions. Mongoose automatically looks for the plural version of your model name.

//a constructor in a class is a special type of subroutine called to create an object.
var User = mongoose.model("User", userSchema);
module.exports = User;