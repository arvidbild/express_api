"use strict"

var mongoose = require("mongoose");


var Schema = mongoose.Schema;
var courseSchema = new Schema({
    
    user: {
        type: Schema.Types.ObjectId,
        ref: "User" 
    },
    
    title: {
        type: String,
    required: [true, "You have to provide a title"]
    },
    
    description: {
        type: String,
    required: true
    },
    
    estimatedTime: {
        type: String    
    },
    
    materialsNeeded: {
        type: String,
    },
    
    steps: [{
  
  stepNumber: Number,
       title:{ 
        type: String,
    required: [true, "you have to provide a title"]},
 
description: {
        type: String,
    required: [true, "you have to provide a description"],
    }
}],
    
   reviews: [{
      type: Schema.Types.ObjectId,
       ref: "Review"
   }],
});

var Course = mongoose.model("Course", courseSchema);

module.exports = Course;