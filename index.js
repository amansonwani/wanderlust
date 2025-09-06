const express= require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");


const path = require("path");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ListingRoutes = require("./Routes/ListingRoutes.js");
const ReviewRoutes = require("./Routes/ReviewRoutes.js");
const userRouter = require("./Routes/userRouter.js");

const dbUrl = process.env.ATLAS_DB;

main().then((res)=>{
    console.log("connection successfull");
}).catch(err=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(dbUrl);
}

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs"); 
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);



const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto  : {
          secret: process.env.SECRET ,
    },
    touchAfter: 24 * 3600,
});

store.on("error",()=>{
    console.log("-------ERROR-------");
});
const sessionOption  = {
    store: store, 
    secret: process.env.SECRET ,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:  7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    next();
});
app.get("/",(req,res)=>{
res.redirect("/listing");
});




app.use("/listing",ListingRoutes);
app.use("/listing/:id/review",ReviewRoutes);
app.use("/",userRouter);

// app.get("/register",async(req,res)=>{
//     let fakeUser = new User({
//         email: "aman@gmail.com",
//         username: "delta-student"
//     });
//     let newUser = await User.register(fakeUser,"helloworld");
//     res.send(newUser);
// });

app.use((err,req,res,next)=>{
    let {status=500,message="server problem"} = err;
    // res.status(status).send(message);
    res.render("Error.ejs",{message});
});

 app.listen(port,()=>{
    console.log(`server listening on port  ${port}`);

 });



