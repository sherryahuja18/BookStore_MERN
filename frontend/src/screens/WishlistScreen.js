import React, { useEffect, useState } from 'react';
import { useUserContext } from '../components/UserContext';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Card, Image } from 'react-bootstrap';

const baseurl  = 'http://localhost:4000'

const WishlistScreen = () => {
  const { userInfo } = useUserContext();
  const [wishlist, setWishlist] = useState([]);
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
    selectedBooks: [],
  });

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    if (userInfo && userInfo.user && userInfo.user.email) {
      const userWishlist = storedWishlist.filter(item => item.userId === userInfo.user.email);
      setWishlist(userWishlist);
    }
  }, [userInfo]);

  const handleCreateCollection = async () => {
    try {
      // Fetch details for the selected books
      const selectedBooksDetails = wishlist
        .filter(item => newCollection.selectedBooks.includes(item.bookId))
        .map(({ bookId, title, author, price, thumbnail }) => ({
          bookId,
          title,
          author,
          price,
          thumbnail,
        }));

      // Make a POST request to create a new book collection
      const response = await axios.post(`${baseurl}/wishlist/create`, {
        name: newCollection.name,
        description: newCollection.description,
        userId: userInfo.user.email,
        books: selectedBooksDetails,
      });

      console.log('New book collection created:', response.data);

      // Clear the form after successful creation
      setNewCollection({
        name: '',
        description: '',
        selectedBooks: [],
      });

      // Optionally, you can fetch and update the user's collections after creating a new one
      // ...

    } catch (error) {
      console.error('Error creating book collection:', error.message);
    }
  };

  const handleCheckboxChange = (bookId) => {
    // Toggle the selected state of the book
    setNewCollection(prevState => {
      const isSelected = prevState.selectedBooks.includes(bookId);

      if (isSelected) {
        // Remove from selectedBooks
        return {
          ...prevState,
          selectedBooks: prevState.selectedBooks.filter(id => id !== bookId),
        };
      } else {
        // Add to selectedBooks
        return {
          ...prevState,
          selectedBooks: [...prevState.selectedBooks, bookId],
        };
      }
    });
  };

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">Books</h1>

      {/* Display wishlist books with checkboxes */}
      <Row className="justify-content-center">
        {wishlist.map(item => (
          <Col key={item.bookId} md={4} className="mb-3">
             <Card style={{ background: 'linear-gradient(to right, #4CAF50, #2196F3)' }} className="h-100">
              <Card.Body>
                <div className="text-center">
                  <Image src={item.thumbnail} alt={item.title} fluid />
                </div>
                <Form.Check
                  className="mt-3 text-center"
                  type="checkbox"
                  label={
                    <div>
                      <strong>{item.title} by {item.author}</strong>
                    </div>
                  }
                  checked={newCollection.selectedBooks.includes(item.bookId)}
                  onChange={() => handleCheckboxChange(item.bookId)}
                />
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Create New Collection Form */}
      <Row className="justify-content-center mt-4">
        <Col md={6}>
          <h2>Create a New Collection</h2>
          <Form>
            <Form.Group controlId="collectionName">
              <Form.Label>Name:</Form.Label>
              <Form.Control
                type="text"
                value={newCollection.name}
                onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="collectionDescription">
              <Form.Label>Description:</Form.Label>
              <Form.Control
                as="textarea"
                value={newCollection.description}
                onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
              />
            </Form.Group>
            <p></p>
            <div className="mb-3">
              <Button variant="primary" onClick={handleCreateCollection}>
                Create Collection
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default WishlistScreen;
