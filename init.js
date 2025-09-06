const express= require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const data = require("./data.js");



main().then((res)=>{
    console.log("connection successfull");
}).catch(err=>{
    console.log(err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust5");
}

const initDb = async()=>{
 await Listing.deleteMany({});
 await Listing.insertMany(data);
 console.log("initialization successfull");
}
initDb();

 app.listen(port,()=>{
    console.log(`server listening on port  ${port}`);
 });