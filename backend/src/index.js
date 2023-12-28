const express = require("express");
const app = express();                                      
const cors = require('cors');
const userRouter = require("./routes/userRoutes");
const cartRouter = require("./routes/cartRoutes");
const stripeRouter = require("./routes/stripeRoutes");
const authRouter = require("./routes/authRoutes");
const wishlistRouter = require("./routes/wishlistRoutes");
const passport = require('./middlewares/passport-config');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
app.use(bodyParser.json());

require('dotenv').config();




// Middleware to initialize Passport
app.use(session({ secret: 'A8lgwryZ7jg0MFHvslXOJHQqA2GE', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());


app.use(cors());
app.use(express.json());       //middleware1 - converts request body ( stream type) to String 


//declare routes here
app.use("/users",userRouter);
app.use("/cart",cartRouter);
app.use("/stripe",stripeRouter);
app.use("/auth",authRouter);
app.use("/wishlist",wishlistRouter);

app.get("/",(req,res)=>{
    res.send("hi");
})

console.log(`HOST URL is ${process.env.HOST_URL}${process.env.PORT}`);
//mongodb connection
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    const port = process.env.PORT
    app.listen(port || 5000,()=>{
        console.log(`server started and listening at port ${port}`);
    });
})
.catch((error)=>{
    console.log(error);
});



