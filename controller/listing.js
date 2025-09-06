const Listing = require("../models/listing.js");

// app.get("/listingTest",(req,res)=>{
//     let sampleList = new Listing({
//         title: "my villa",
//         description: "Nice Villa",
//         price: 1200,
//         location: "Raipur",
//         country: "india"
//     });
// sampleList.save().then((res)=>{
//     console.log(res);
// }).catch(err=>{
//     console.log(err);
// })
// res.send("working");
// });

//index route
module.exports.index = async(req,res)=>{
    let allListing = await Listing.find();
    res.render("./listing/index.ejs",{allListing});
};

//get new listing
module.exports.new = (req,res)=>{
    // console.log(req.user);
   res.render("./listing/new.ejs");
    
};

//show route
module.exports.show = async(req,res)=>{
    let {id} = req.params;
    let data = await Listing.findById(id).populate({path: "review",populate:{path: "reviewOwner"}}).populate("owner"); 
    // console.log(data);
    if(!data){
        req.flash("error","Listing doesn't exist");
        res.redirect("/listing");
    }else{
        res.render("./listing/show.ejs",{data});
    }       
};

//create listing post route
module.exports.create = async(req,res,next)=>{
    // let {title,description,image,price,location,country} = req.body;
    // let newList = new Listing({
    //     title : title,
    //     description : description,
    //     image: image,
    //     price : price,
    //     location : location,
    //     country : country
    // });
    // newList.save().then((res)=>{
    //     console.log(newList);
    // }).catch(err=>{
    //     console.log(err);
    // })
   let url = req.file.path;
   let filename = req.file.filename;
   console.log(url ," .. ",filename);
     const newListing =  new Listing(req.body.listing);
    console.log(newListing);
     newListing.owner = req.user._id;
     newListing.image = {url,filename};
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listing");
};

//edit get
module.exports.getEdit = async(req,res)=>{
    let {id} = req.params;
    let data = await Listing.findById(id);
    if(!data){
        req.flash("error","Listing doesn't exist");
        res.redirect("/listing");
    }else{
       res.render("./listing/edit.ejs",{data});   
    }
};

//update edit route
module.exports.update = async(req,res)=>{
    
    let {id} = req.params;

     if(!req.body.listing){
    throw new ExpressError(400,"Bad Reqest");
   }
    let updatedList = await Listing.findByIdAndUpdate(id,{ ...req.body.listing});
   if(req.file){
     let url = req.file.path;
    let filename = req.file.filename;
    updatedList.image = {url,filename};
    await updatedList.save();
   }
    req.flash("success","Listing Updated Successfully");
    res.redirect(`/listing/${id}`);
};

//delete listing
module.exports.delete = async(req,res)=>{
    let {id} = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    console.log(deletedList);
    req.flash("success","Listing Deleted successfully");
    res.redirect("/listing");
};