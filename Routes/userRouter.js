const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const  Passport  = require("passport");
const {saveRedirectUrl} =  require("../middleware.js");
const userController = require("../controller/user.js");


//signup on wanderlust

router.route("/signUp")
.get(userController.getSignUp)
.post(wrapAsync(userController.postSignUp));


// router.get("/signUp",userController.getSignUp);

// router.post("/signup",wrapAsync(userController.postSignUp));

//login on wanderlust
router.route("/login")
.get(userController.getLogin)
.post(saveRedirectUrl,Passport.authenticate("local",{
    failureRedirect: "/login",
    failureFlash: true
}),userController.postLogin);

// router.get("/login",userController.getLogin);

// router.post("/login",saveRedirectUrl,Passport.authenticate("local",{
//     failureRedirect: "/login",
//     failureFlash: true
// }),userController.postLogin);

//log out
router.get("/logout",userController.logout);

  module.exports = router;