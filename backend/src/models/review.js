// ReviewModel.js

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  booklistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wishlist', // Assuming your booklist model is named 'Wishlist'
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  visibility: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

const ReviewModel = mongoose.model('Review', reviewSchema);

module.exports = ReviewModel;
