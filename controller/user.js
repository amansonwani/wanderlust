const User = require("../models/user.js");
//get signUp form
module.exports.getSignUp = (req,res)=>{
    res.render("users/signup.ejs");
};

//post signUp form
module.exports.postSignUp = async(req,res)=>{
    try{
       let {username,email,password}  = req.body;
    let newUser = new User({
       username: username,
       email: email
    });
    const registeredUser = await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
      if(err){
        next(err);
      }else{
        req.flash("success","Welcome to wanderlust");
        res.redirect("/listing");
      }
    });
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
};

//get Login form
module.exports.getLogin = (req,res)=>{
    res.render("./users/login.ejs");
};

//post Login Form
module.exports.postLogin = async(req,res)=>{
   if(res.locals.redirectPath){
    req.flash("success","Welcome back on wanderlust!");
   res.redirect(res.locals.redirectPath);
   }else{
    req.flash("success","Welcome back on wanderlust!");
    res.redirect("/listing");
   }
};

//logout
module.exports.logout = (req,res,next)=>{
   req.logout((err)=>{
     if(err){
       next(err);
     }else{
        req.flash("success","you are successfully logout!");
        res.redirect("/listing");
     }
   });
};