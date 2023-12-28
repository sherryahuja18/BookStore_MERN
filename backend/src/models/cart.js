const mongoose = require("mongoose");

const CartSchema = mongoose.Schema({
    userId: { type: String, required: true },
    books: [
        {
            booksId:{type:String ,required:true},
            quantity: {
                type: Number,
                default: 1,
            },
            title:{type:String ,required:true},
            image:{type:String ,required:true},
            price:{type:String ,required:true},
        }]
}, {timestamps:true})

module.exports= mongoose.model("Cart",CartSchema);