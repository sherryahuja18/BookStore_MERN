const express = require('express');
const {payment} = require('../controllers/stripeController');
const stripeRouter = express.Router();
const auth = require("../middlewares/auth");

    

stripeRouter.post("/payment",payment);  


module.exports = stripeRouter;