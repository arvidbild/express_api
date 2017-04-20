"use strict";

var express = require("express");
var router = express.Router();
var auth = require('basic-auth')
 
var User = require("../models/User");
var Course = require("../models/Course");
var Review = require("../models/Review");
var mid = require("../middleware/middleware");


//GET /api/users 200 - Returns the currently authenticated user
router.get("/api/users", mid.requireAuth, function(req,res,next){
  
       
    User.findOne({ _id: req.userId })
        .select('-hashedPassword')
        .exec(function (err, user) {
            if (err) return next(err);
            res.status(200).json({ data: [user] });
        });  
   

       
});


//POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
router.post("/api/users", function(req, res, next) {

    // Check for password match
    var password = "";
    if (req.body
        && req.body.password
        && req.body.confirmPassword
        && req.body.password === req.body.confirmPassword) {
            password = req.body.password;
    }

    // Make a new user object
    var user = new User({
        fullName: req.body.fullName,
        emailAddress: req.body.emailAddress,
        hashedPassword: password
    });

    // Attempt to save the new user
    user.save(function (err) {
        if (err) {
            if (err.name === 'ValidationError') {
                // Handle validation errors
                res.status(400);
                res.json({Validationerror: 400});
            } else {
                return next(err);
            }
        } else {
            // Set headers and send the response
            res.status(201).location('/').send();
        }
    });
});


//GET /api/courses 200 - Returns the Course "_id" and "title" properties

router.get("/api/courses", function(req,res,next){

  Course.find("_id","title").exec(function(err,course){
        res.status(200);
        res.json({data: course});
    });
});

//GET /api/course/:courseId 200 - Returns all Course properties and related documents for the provided course ID

//When returning a single course for the GET /api/courses/:courseId route, use Mongoose population to load the related user and reviews documents.

router.get("/api/courses/:id", function(req,res,next){
    
Course.findById(req.params.id)
    .populate({
    path: "user",
    model: "User"
})
    .populate({
    path: "reviews",
    model: "Review"
})
    .exec(function(err,courseId){
       res.status(200);
       res.json({data: courseId});
    });
});

//POST /api/courses 201 - Creates a course, sets the Location header, and returns no content

router.post("/api/courses", mid.requireAuth, function(req,res,next){
    
    //creating a new course object.
    var course = new Course(req.body);
    
    //adding the new course
    course.save(function(err){
        
    if (err){
        
            if(err.name === "ValidationError"){
            res.json({ValidationError: 400});
            } else { 
            return next(err);  
            }
        
    }else {
    res.status(201).location("/").send();
    }
    });
});


// PUT /api/courses/:courseId 204 - Updates a course and returns no content

router.put("/api/courses/:id", mid.requireAuth, function(req,res,next) {
    
   var course = new Course(req.body);
    
    Course.update({_id: course.Id}, course, function(err, result){
        if(err){
            return next(err);
        } else {       
            res.status(204).send();
        }
    });
});

//POST /api/courses/:courseId/reviews 201 - Creates a review for the specified course ID, sets the Location header to the related course, and returns no content

router.post("/api/courses/:courseId/reviews", mid.requireAuth, function(req, res, next) {

    //find a user and prevent the user from reviewing its own course. 
    Course.findById(req.params)
    .populate("reviews")    
    .exec(function(err, course){
    
   
        
    //adding the new review by first creating a new review object and then .save method. 
    req.body.user = req.userId;    
    var review = new Review(req.body);
        
    /** the review object looks like this. 
{ rating: 10,
  user: 57029ed4795118be119cc437,
  _id: 58f8db19d2e6fe29a0a558b4 }
**/ 
    
        review.save(function(err){
          
        if (err){
            
            if(err.name === "ValidationError"){
                res.json({ValidationError: 400});
            } else{ 
                return next(err);  
            }
        
            
        } else {
        
        //get the course and link it to the review. 
        Course.findOne({_id: req.params.courseId}).exec(function(err, course){
        
        console.log(course);
            if(err) return next (err);  
            
        course.reviews.push(review._id);        
        
        course.save( function (err, result){
           if(err) return next(err);
        console.log(result)    
        res.status(201).location('/courses/' + result._id).send();
    
                    });        
                });
            }
        });
    }); //closing the Course.findById().exec()
}); //closing the .post method


module.exports = router;