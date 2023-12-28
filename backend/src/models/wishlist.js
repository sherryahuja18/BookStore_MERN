const mongoose = require("mongoose");

const WishlistSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    isPrivate: { type: Boolean, default: true },
    books: [
        {
            bookId:{type:String ,required:true},
            title:{type:String ,required:true},
            thumbnail:{type:String ,required:true},
            price:{type:String ,required:true},
            author:{type:String ,required:true},
        }]
}, {timestamps:true})

module.exports= mongoose.model("Wishlist",WishlistSchema);