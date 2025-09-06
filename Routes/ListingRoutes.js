if(process.env.NODE_ENV!="production"){
require("dotenv").config();
} 
// console.log(process.env.SECRET);


const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const listingSchema = require("../listingSchema.js");
const Listing = require("../models/listing.js");
const passport = require("passport");
const {isLoggedIn,isOwner} = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


const validateListing = (req,res,next)=>{
   let {error} = listingSchema.validate(req.body);
   if(error){
    throw new ExpressError(400,error);
   }else{
    next();
   }
}
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.create));
// .post(upload.single('listing[image]'),(req,res)=>{
//    res.send(req.file.path);
//    // console.log(req.body);
// });


// router.get("/",wrapAsync(listingController.index));

// new listing
router.get("/new",isLoggedIn,listingController.new);

router.route("/:id")
.get((listingController.show))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.update))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.delete));

//show route
// router.get("/:id",wrapAsync(listingController.show));

// create route
// router.post("/",isLoggedIn,validateListing,wrapAsync(listingController.create));

//edit and update
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.getEdit));

// router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.update));

//delete
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.delete));

module.exports = router;
