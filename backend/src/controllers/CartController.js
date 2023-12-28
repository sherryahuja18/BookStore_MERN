
const CartModel = require("../models/cart");


//create a cart  - if empty create, otherwise add book quantity or book itself
const createCart = async(req,res) => {
    
    const { userId, bookId, quantity,title,image,price } = req.body;
    
    try {
       
    let cart = await CartModel.findOne({ userId :userId });
   
      console.log('price',price);
      if (!cart) {
      cart = new CartModel({ userId, books: [{ booksId: bookId, title: title, image: image,price:price  }] });
      await cart.save();
      res.status(200).json(cart);
    }else{
        const existingBook = cart.books.find(book => book.booksId === bookId);
        if (existingBook) {
          existingBook.quantity += quantity;
        } else {
          cart.books.push({ booksId: bookId, quantity, title: title, image: image ,price:price});
        }
        await cart.save();
        res.status(200).json(cart);
    }
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"something went wrong"});
    }
}

//get User Cart  - total cost will be added by FE
const getUserCart = async(req,res) => {
    try {
        const cart = await CartModel.findOne({userId: req.params.userid});
        res.status(200).json(cart);

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"something went wrong"});
    }
}


//update User Cart- remove item from the cart
const updateUserCart = async(req,res) => {
    try {
       
    const { userId, bookId,deletion } = req.body;

    let cart = await CartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found for the specified user.' });
    }

    const bookIndex = cart.books.findIndex(book => book.booksId === bookId);

    if (bookIndex !== -1) 
    {

      if(deletion=="partial")
      {
        if (cart.books[bookIndex].quantity > 1) {
          cart.books[bookIndex].quantity -= 1;
        } else {
          cart.books.splice(bookIndex, 1); 
        }
      }else if(deletion=="full"){
        cart.books.splice(bookIndex, 1);
      }else{
        return res.status(404).json({ error: 'specify kind of deletion' });
      }

      await cart.save();
      return res.status(200).json(cart);

    } 
    else 
    {
      // If the book is not in the cart, return an error
      return res.status(404).json({ error: 'Book not found in the user cart.'});
    }

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"something went wrong"});
    }
}



module.exports = {getUserCart,updateUserCart,createCart};