

const express = require('express');
const {togglevisibility,createWishlist ,getUserBooklists,updateBooklist,getpublicbooklists,addreview,getreviews,deleteBooklist} = require('../controllers/WishlistController');
const wishlistRouter = express.Router();

    
wishlistRouter.post("/create", createWishlist);    
wishlistRouter.get("/getuserbooklists/:userId", getUserBooklists); 
wishlistRouter.get("/getpublicbooklists", getpublicbooklists);
wishlistRouter.post('/update/:booklistId', updateBooklist);                       
wishlistRouter.post('/addreview', addreview); 
wishlistRouter.get("/getreviews/:booklistId", getreviews);
wishlistRouter.post('/admin/togglevisibility/:reviewId', togglevisibility);   //admin
wishlistRouter.delete('/delete/:booklistId',deleteBooklist);


module.exports = wishlistRouter;