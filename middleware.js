const Listing = require("./models/listing.js");
const review = require("./models/review.js");
module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl;
      console.log(req.session.redirectUrl);
      
        req.flash("error","you must be logged in!");
          res.redirect("/login");
    }else{
      next();
    }
}

module.exports.saveRedirectUrl = (req,res,next)=>{
  res.locals.redirectPath = req.session.redirectUrl;
  console.log(res.locals.redirectPath);
  next();
}
 

module.exports.isOwner=async(req,res,next)=>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.currUser._id)){
     req.flash("error","you don't have a permission");
     res.redirect(`/listing/${id}`);
  }else{
    next();
  }
}



module.exports.isAuthor = async(req,res,next)=>{
  let {id,reviewid} = req.params;
  let Review = await review.findById(reviewid);
  if(!Review.reviewOwner.equals(res.locals.currUser._id)){
     req.flash("error","you don't have a permission");
     res.redirect(`/listing/${id}`);
  }else{
    next();
  }
}
