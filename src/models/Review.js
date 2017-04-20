"use strict"

var mongoose = require("mongoose");



var Schema = mongoose.Schema;
var reviewSchema = new Schema ({
   
    user: {
    type: Schema.Types.ObjectId,
     ref: "User"
    },
    
postedOn: {
    type: Date,
 defualt: Date.now
    },
    
  rating: {
    type: Number,
required: [true, "You have to provide a number"],
     max: 5,
     min: 1
  },
    
  review: {
    type: String
  } 
});

var Review = mongoose.model("Review", reviewSchema);
module.exports = Review;