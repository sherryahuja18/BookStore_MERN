import { useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Book from '../components/Book';
import { useUserContext } from '../components/UserContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const baseurl  = 'http://localhost:4000'

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, books: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const HeroSection = () => {
  const heroStyles = {
    background: 'url("/images/background.png") center/cover',
    height: '300px', // Adjust the height as needed
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    position: 'relative',
    marginBottom: '20px',
  };

  // Semi-transparent overlay styles
  const overlayStyles = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the alpha (last value) for opacity
  };

  return (
    <div style={heroStyles}>
      <div style={overlayStyles}></div>
      <h1 style={{ fontSize: '36px', zIndex: 1 }}>Welcome to Our Bookstore</h1>
      <p>Discover Worlds Between Pages: Your Gateway to Endless Stories!</p>
    </div>
  );
};

function HomeScreen() {
  const { isAuthenticated, userInfo } = useUserContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [{ loading, error, books }, dispatch] = useReducer(reducer, {
    books: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });

      try {
        let maxResults = 10;
        if (isAuthenticated) {
          maxResults = 25;
        }
        const result = await axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=javascript&maxResults=${maxResults}`
        );

        const formattedBooks = result.data.items.map((item) => {
          const hasPrice = item.saleInfo && item.saleInfo.retailPrice;
          return {
            bookId: item.id,
            title: item.volumeInfo.title,
            author: item.volumeInfo.authors
              ? item.volumeInfo.authors[0]
              : 'Unknown',
            price: hasPrice
              ? `${item.saleInfo.retailPrice.amount} ${item.saleInfo.retailPrice.currencyCode}`
              : 'Not for sale',
            thumbnail: item.volumeInfo.imageLinks
              ? item.volumeInfo.imageLinks.thumbnail
              : 'https://via.placeholder.com/150',
          };
        });

        dispatch({ type: 'FETCH_SUCCESS', payload: formattedBooks });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };

    fetchData();
  }, []);

  const handleSearch = async () => {
    try {
      dispatch({ type: 'FETCH_REQUEST' });

      let maxResults = 10;
      if (isAuthenticated) {
        maxResults = 25;
      }

      maxResults = 24;

      const result = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&maxResults=${maxResults}`
      );

      const formattedBooks = result.data.items.map((item) => {
        const hasPrice = item.saleInfo && item.saleInfo.retailPrice;
        return {
          bookId: item.id,
          title: item.volumeInfo.title,
          author: item.volumeInfo.authors
            ? item.volumeInfo.authors[0]
            : 'Unknown',
          price: hasPrice
            ? `${item.saleInfo.retailPrice.amount} ${item.saleInfo.retailPrice.currencyCode}`
            : 'Not for sale',
          thumbnail: item.volumeInfo.imageLinks
            ? item.volumeInfo.imageLinks.thumbnail
            : 'https://via.placeholder.com/150',
        };
      });

      dispatch({ type: 'FETCH_SUCCESS', payload: formattedBooks });
    } catch (err) {
      dispatch({ type: 'FETCH_FAIL', payload: err.message });
    }
  };

  const addToCartHandler = async (bookId, bookTitle, bookImage, price) => {
    console.log('Adding to cart with price:', price);
    try {
      let userId;

      if (isAuthenticated) {
        userId = userInfo.user.email;
      } else {
        console.log(
          'User is not signed in. Show a login modal or redirect to the login page.'
        );
        return;
      }

      const response = await axios.post(`${baseurl}/cart/create`, {
        userId,
        bookId,
        quantity: 1,
        title: bookTitle,
        image: bookImage,
        price: price,
      });

      console.log('Book added to cart:', response.data);
      toast.success('Book successfully added to cart');
    } catch (error) {
      console.error('Error adding book to cart:', error.message);
    }
  };

  const addToWishlistHandler = async (
    bookId,
    bookTitle,
    bookImage,
    price,
    author
  ) => {
    try {
      let userId;
      if (isAuthenticated) {
        userId = userInfo.user.email;
      } else {
        console.log(
          'User is not signed in. Show a login modal or redirect to the login page.'
        );
        return;
      }

      const existingWishlist = localStorage.getItem('wishlist');
      const wishlist = existingWishlist ? JSON.parse(existingWishlist) : [];

      const isBookInWishlist = wishlist.some(
        (item) => item.userId === userId && item.bookId === bookId
      );

      if (!isBookInWishlist) {
        wishlist.push({
          userId,
          bookId,
          title: bookTitle,
          author: author,
          thumbnail: bookImage,
          price: price,
        });

        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        console.log('Book added to booklist :', wishlist);
        toast.success('Book successfully added to booklist');
      } else {
        console.log(
          'Book is already in the booklist for this user:',
          bookTitle
        );
      }
    } catch (error) {
      console.error('Error adding book to wishlist:', error.message);
    }
  };

  const navigate = useNavigate();
  const handleBookClick = (bookId) => {
    console.log(`Book clicked: ${bookId}`);
    navigate(`/book/${bookId}`);
  };

  const styles = {
    container: {
      width: '100%',
      padding: '0px',
    },
    heading: {
      fontSize: '32px',
      marginBottom: '20px',
      textAlign: 'center',
    },
    books: {
      listStyle: 'none',
      padding: 0,
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    footer: {
      width: '100vw',
      position: 'relative',
      left: '50%',
      right: '50%',
      marginLeft: '-50vw',
      marginRight: '-50vw',
      marginTop: '20px',
      padding: '20px 0',
      color: '#fff',
      textAlign: 'center',
      backgroundImage: 'linear-gradient(to right, #0a0a0a, #333)', // Black linear gradient
    },
    socialIcons: {
      fontSize: '24px',
      margin: '0 10px',
      color: '#fff',
    },
    contactInfo: {
      marginBottom: '10px',
    },
    copyright: {
      marginTop: '10px',
    },

    searchContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '20px',
    },
    searchBar: {
      width: '500px',
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid black',
      marginRight: '10px',
    },
    searchButton: {
      padding: '10px',
      borderRadius: '5px',
      backgroundColor: '#007bff',
      color: '#fff',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <Helmet>
        <title>Bookstore</title>
      </Helmet>

      <HeroSection />

      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search for books..."
          value={searchTerm}
          style={styles.searchBar}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          variant="primary"
          onClick={handleSearch}
          style={styles.searchButton}
        >
          Search
        </button>
      </div>

      <div className="books">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {books.map((book, index) => (
              <Col
                border="success"
                key={index}
                sm={6}
                md={4}
                lg={3}
                className="mb-3"
              >
                <Book
                  variant="dark"
                  book={book}
                  onClick={() => handleBookClick(book.bookId)}
                  onAddToCart={addToCartHandler}
                  onAddToWishlist={addToWishlistHandler}
                />
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p style={styles.contactInfo}>Follow us on social media:</p>
        <div>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i
              className="fab fa-facebook-square"
              style={styles.socialIcons}
            ></i>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-twitter-square" style={styles.socialIcons}></i>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i
              className="fab fa-instagram-square"
              style={styles.socialIcons}
            ></i>
          </a>
          {/* Add more social media icons as needed */}
        </div>
        <p style={styles.contactInfo}>Contact us: shuja49@uwo.com</p>
        <p style={styles.copyright}>
          &copy; 2023 Bookstore. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default HomeScreen;
