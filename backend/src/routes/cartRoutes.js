

const express = require('express');
const {getUserCart,updateUserCart,createCart } = require('../controllers/CartController');
const cartRouter = express.Router();
const auth = require("../middlewares/auth");

    

cartRouter.get("/getusercart/:userid",getUserCart);   // get user cart
cartRouter.post("/update", updateUserCart);           //delete a book from the cart
cartRouter.post("/create", createCart);              //append book into the cart


module.exports = cartRouter;