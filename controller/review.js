const Listing = require("../models/listing.js");
const review = require("../models/review.js");

//review post route
module.exports.postReview = async(req,res)=>{
    let {id} = req.params;
    
    let listing  =  await Listing.findById(id);
    //  console.log(listing);
     let newReview = new review(req.body.review);
    //  console.log(newReview);
     newReview.reviewOwner = req.user._id;
       console.log(newReview);
     listing.review.push(newReview);
     
     await newReview.save();
     let result = await listing.save();
    //  console.log(result);
     req.flash("success","New Review Created");
     res.redirect(`/listing/${id}`);
    };

    //delete review
    module.exports.deleteReview = async(req,res)=>{
            let {id,reviewid} = req.params;
            await Listing.findByIdAndUpdate(id,{$pull : {review: reviewid}});
            let result = await review.findByIdAndDelete(reviewid);
            // console.log(result);
            req.flash("success","Review deleted");
            res.redirect(`/listing/${id}`);
        };