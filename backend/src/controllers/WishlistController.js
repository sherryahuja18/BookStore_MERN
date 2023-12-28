const WishlistModel = require("../models/wishlist");
const UserModel = require("../models/user");
const ReviewModel = require("../models/review");

const createWishlist = async(req,res) => {
    
  const { name, description, userId, books } = req.body;
    
    try {
       
      if (!name || !userId || !books || !Array.isArray(books)) {
        return res.status(400).json({ error: 'Invalid request data' });
      }

      const formattedBooks = books.map(book => ({
        bookId: book.bookId,
        title: book.title,
        thumbnail: book.thumbnail,
        price: book.price,
        author: book.author,
      }));

      let wishlist = new WishlistModel({ userId, name, description, books: formattedBooks });
      await wishlist.save();
      res.status(201).json(wishlist);
    } catch (error) {
      console.error('Error creating wishlist:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getUserBooklists = async (req, res) => {
  try {
    const userBooklists = await WishlistModel.find({ userId: req.params.userId });
    res.status(200).json(userBooklists);
  } catch (error) {
    console.error('Error fetching user booklists:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const getpublicbooklists = async (req, res) => {
  try {
    const userBooklists = await WishlistModel.find({ isPrivate: false })
      .sort({ updatedAt: -1 });
    const booklistsWithFullName = await Promise.all(
      userBooklists.map(async (booklist) => {
        const user = await UserModel.findOne({ email: booklist.userId });
        const fullName = user ? user.fullname : 'null';
        console.log('fullname - ',fullName);
        return { ...booklist.toObject(), fullName };
      })
    );
    res.status(200).json(booklistsWithFullName);
  } catch (error) {
    console.error('Error fetching user booklists:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


const updateBooklist = async (req, res) => {
  const { name, description, userId, books,isPrivate } = req.body;

  try {
    if (!name || !userId || !books || !Array.isArray(books)) {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    const formattedBooks = books.map((book) => ({
      bookId: book.bookId,
      title: book.title,
      thumbnail: book.thumbnail,
      price: book.price,
      author: book.author,
    }));

    const updatedWishlist = await WishlistModel.findByIdAndUpdate(
      req.params.booklistId,
      { userId, name, description, books: formattedBooks ,isPrivate},
      { new: true } 
    );

    if (!updatedWishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }

    res.status(200).json(updatedWishlist);
  } catch (error) {
    console.error('Error updating wishlist:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteBooklist = async (req, res) => {
  try {
    const { booklistId } = req.params;
    await WishlistModel.findByIdAndDelete(booklistId);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addreview = async(req,res) => {
    
  const { userId, booklistId, review } = req.body;

  try {
    const booklist = await WishlistModel.findById(booklistId);

    if (!booklist) {
      return res.status(404).json({ error: 'Booklist not found' });
    }

    const newReview = new ReviewModel({
      userId,
      booklistId,
      review,
    });

    await newReview.save();

    res.status(201).json(newReview);
  } catch (error) {
    console.error('Error adding review:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const getreviews = async (req, res) => {
  try {
    const reviews = await ReviewModel.find({ booklistId: req.params.booklistId });
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching user booklists:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const togglevisibility = async(req,res) => {
  try {
    const { visibility } = req.body;
    await ReviewModel.findByIdAndUpdate(req.params.reviewId, { visibility });
    res.json({ message: 'Visibility toggled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {togglevisibility,createWishlist,getUserBooklists,updateBooklist,getpublicbooklists,addreview,getreviews,deleteBooklist};