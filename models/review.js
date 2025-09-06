
const mongoose = require("mongoose");
const Schema = mongoose;
const reviewSchema = new mongoose.Schema({
    comment: {
        type: String,
    },
    rating: {
        type: Number,
        min: 1,max: 5,
    },
    created_At: {
        type: Date,
        default: Date.now()
    },
    reviewOwner:{
        type: Schema.Types.ObjectId,
        ref: "user"
    }
});

const review  = mongoose.model("review",reviewSchema);




module.exports = review;