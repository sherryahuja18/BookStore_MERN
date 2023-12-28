import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { useNavigate } from 'react-router-dom';
import { useUserContext } from './UserContext';

const Book = ({ book, onAddToCart, onAddToWishlist, onClick }) => {
  const { isAuthenticated } = useUserContext();
  const navigate = useNavigate();

  const [isAddToCartHovered, setAddToCartHovered] = useState(false);
  const [isAddToCartClicked, setAddToCartClicked] = useState(false);

  const [isWishlistHovered, setWishlistHovered] = useState(false);
  const [isWishlistClicked, setWishlistClicked] = useState(false);

  const handleClick = () => {
    console.log('Book component clicked');
    onClick(); // Ensure that onClick is called
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(book.bookId, book.title, book.thumbnail, book.price);
    setAddToCartClicked(true);

    // Reset the click status after a short delay
    setTimeout(() => {
      setAddToCartClicked(false);
    }, 300);
  };

  const handleAddToWishlist = (e) => {
    e.stopPropagation();
    onAddToWishlist(book.bookId, book.title, book.thumbnail, book.price, book.author);
    setWishlistClicked(true);

    // Reset the click status after a short delay
    setTimeout(() => {
      setWishlistClicked(false);
    }, 300);
  };

  const navigateToDetails = () => {
    navigate(`/book/${book.bookId}`); // Navigate to book details page
  };

  const isForSale = book.price !== "Not for sale";

  const styles = {
    card: {
      display: 'flex',
      flexDirection: 'column',
      width: '70%',
      border: '2px solid black',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      marginBottom: '20px',
      backgroundColor: 'white',
      height: '600px', // Set a fixed height for the card
      cursor: 'pointer',
    },
    imageContainer: {
      flex: '1', // Take the remaining space
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%', // Take up the entire height of the image container
      objectFit: 'cover',
    },
    content: {
      padding: '15px',
    },
    title: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '10px',
    },
    author: {
      color: 'black',
      marginBottom: '10px',
    },
    price: {
      color: '#007bff',
      fontWeight: 'bold',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '15px',
      gap:'10px'
    },
    addButton: {
      backgroundColor: isAddToCartHovered ? '#218838' : isAddToCartClicked ? '#5cb85c' : '#28a745',
      padding: isAddToCartClicked ? '9px 13px' : '8px 12px',
      borderRadius: '5px',
      color: '#fff',
      cursor: 'pointer',
      transition: 'padding 0.3s',
    },
    wishlistButton: {
      backgroundColor: isWishlistHovered ? '#0056b3' : isWishlistClicked ? '#007bff' : '#007bff',
      padding: isWishlistClicked ? '9px 13px' : '8px 12px',
      borderRadius: '5px',
      color: '#fff',
      cursor: 'pointer',
      transition: 'padding 0.3s',
    },
  };

  return (
    <div style={styles.card} onClick={handleClick}>
      <img src={book.thumbnail} alt={book.title} style={styles.image} />

      <div style={styles.content}>
        <div style={styles.title}>{book.title}</div>
        <div style={styles.author}>by {book.author}</div>
        <div style={styles.price}>{book.price}</div>

        <div style={styles.buttonContainer}>
        {isForSale &&isAuthenticated && (
          <>
          <button
            style={styles.addButton}
            onClick={(e) => {
              handleAddToCart(e);
            }}
            onMouseEnter={() => setAddToCartHovered(true)}
            onMouseLeave={() => setAddToCartHovered(false)}
          >
            Add to Cart
          </button>
          <button
            style={styles.wishlistButton}
            onClick={(e) => {
              handleAddToWishlist(e);
            }}
            onMouseEnter={() => setWishlistHovered(true)}
            onMouseLeave={() => setWishlistHovered(false)}
          >
            Add to Booklist
          </button>
          </>
          )}
        </div>
      </div>
    </div>
  );
};

Book.propTypes = {
  book: PropTypes.shape({
    bookId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
  onAddToWishlist: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Book;
