import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Image } from 'react-bootstrap';

const ViewBookDetails = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        console.log('bookid - ', bookId);
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
        setBook(response.data.volumeInfo);
        
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <Container style={{ padding: '20px' }}>
      <Row className="justify-content-center align-items-center">
        <Col xs={12} md={6} className="mb-4 text-center">
          {book.imageLinks && book.imageLinks.thumbnail && (
            <Image
              src={book.imageLinks.thumbnail}
              alt={book.title}
              fluid
              className="mb-3"
              style={{ maxWidth: '100%', height: 'auto', maxHeight: '400px' }}
            />
          )}
        </Col>
        <Col xs={12} md={6}>
          <div>
            <h1 className="font-weight-bold mb-4">{book.title}</h1>
            <p className="text-left">
              <strong>Authors:</strong> {book.authors && book.authors.join(', ')}
            </p>
            <div className="mb-3 text-left">
              <strong>Description:</strong>
              <p dangerouslySetInnerHTML={{ __html: book.description }} />
            </div>
            <p className="text-left">
              <strong>Publisher:</strong> {book.publisher}
            </p>
            <p className="text-left">
              <strong>Published Date:</strong> {book.publishedDate}
            </p>
            <p className="text-left">
              <strong>Categories:</strong> {book.categories}
            </p>
            {/* Display other details as needed */}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ViewBookDetails;
