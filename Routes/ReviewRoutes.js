const express = require("express");
const router = express.Router({mergeParams : true});

const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const reviewSchema  = require("../reviewSchema");
const review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isAuthor} = require("../middleware.js");
const reviewController = require("../controller/review.js");

const validateReview = (req,res,next)=>{
    let {error} =reviewSchema.validate(req.body);
   if(error){
    throw new ExpressError(400,error);
   }else{
    next();
   }
}
//Review REST

router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.postReview));

//delete review route 
    router.delete("/:reviewid",isLoggedIn,isAuthor,wrapAsync(reviewController.deleteReview));
   
    module.exports = router;