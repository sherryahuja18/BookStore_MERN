import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserContext } from '../components/UserContext';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  ListGroup,
  Image,
} from 'react-bootstrap';


const baseurl  = 'http://localhost:4000'

const PublicBooklistsScreen = () => {
  const { isAuthenticated, userInfo } = useUserContext();
  const [booklists, setBooklists] = useState([]);
  const [reviews, setReviews] = useState({});
  const [showReviewForm, setShowReviewForm] = useState(null);

  useEffect(() => {
    const fetchPublicBooklists = async () => {
      try {
        const response = await axios.get(`${baseurl}/wishlist/getpublicbooklists`);

        const limit = isAuthenticated ? 20 : 10;

        // Only take the first 'limit' booklists from the response
        const limitedBooklists = response.data.slice(0, limit);
        setBooklists(limitedBooklists);

        const reviewsData = {};
        for (const booklist of response.data) {
          const reviewsResponse = await axios.get(
            `${baseurl}/wishlist/getreviews/${booklist._id}`
          );
          reviewsData[booklist._id] = reviewsResponse.data;
        }
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching public booklists:', error.message);
      }
    };

    fetchPublicBooklists();
  }, []);

  const handleAddReview = async (booklistId, reviewContent) => {
    try {
      await axios.post(`${baseurl}/wishlist/addreview`, {
        userId: userInfo.user.email,
        booklistId,
        review: reviewContent,
      });

      const reviewsResponse = await axios.get(
        `${baseurl}/wishlist/getreviews/${booklistId}`
      );
      setReviews({ ...reviews, [booklistId]: reviewsResponse.data });
    } catch (error) {
      console.error('Error adding review:', error.message);
    }
  };

  const handleToggleVisibility = async (booklistId, reviewId, visibility) => {
    try {
      await axios.post(`${baseurl}/wishlist/admin/togglevisibility/${reviewId}`, {
        visibility: !visibility,
      });

      const updatedReviewsResponse = await axios.get(
        `${baseurl}/wishlist/getreviews/${booklistId}`
      );
      setReviews({ ...reviews, [booklistId]: updatedReviewsResponse.data });
    } catch (error) {
      console.error('Error toggling visibility:', error.message);
    }
  };

  const ReviewForm = ({ booklistId }) => {
    const [reviewContent, setReviewContent] = useState('');

    const handleSubmitReview = () => {
      if (reviewContent.trim() !== '') {
        handleAddReview(booklistId, reviewContent);
        setReviewContent('');
        setShowReviewForm(null);
      }
    };

    return (
      <Form style={{ marginTop: '10px' }}>
        <Form.Group controlId="reviewContent">
          <Form.Control
            as="textarea"
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
            placeholder="Add your review..."
          />
        </Form.Group>
        <Button
          onClick={handleSubmitReview}
          variant="success"
          style={{ marginRight: '10px' }}
        >
          Submit Review
        </Button>
        <Button onClick={() => setShowReviewForm(null)} variant="secondary">
          Cancel
        </Button>
      </Form>
    );
  };

  return (
    <Container style={{ marginTop: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Public Booklists</h2>
      {booklists.map((booklist) => (
        <Row key={booklist._id}>
          <Col md={12} lg={12} style={{ marginBottom: '20px' }}>
            <Card
              style={{
                background: 'linear-gradient(to bottom, #4CAF50, #2196F3)',
              }}
            >
              <Card.Body>
                <Card.Title>{booklist.name}</Card.Title>
                <Card.Text>
                  <strong>Description:</strong> {booklist.description}
                  <br />
                  <strong>Owner:</strong> {booklist.fullName}
                  <br />
                  <strong>Modified on :</strong> {booklist.updatedAt}
                </Card.Text>
              </Card.Body>
              <Card.Body
                style={{
                  background:
                    'linear-gradient(to bottom, rgba(76, 175, 80, 0.5), rgba(33, 150, 243, 0.5), rgba(76, 175, 80, 0.5))',
                }}
              >
                <Card.Title>List of Books</Card.Title>
                <ListGroup>
                  {booklist.books.map((book) => (
                    <ListGroup.Item key={book._id}>
                      <strong></strong> {book.title}
                      <Image
                        src={book.thumbnail}
                        alt={book.title}
                        style={{
                          width: '50px',
                          height: 'auto',
                          marginLeft: '10px',
                        }}
                      />
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
              <Card.Body
                style={{
                  background:
                    'linear-gradient(to bottom, rgba(76, 175, 80, 0.5), rgba(33, 150, 243, 0.5), rgba(76, 175, 80, 0.5))',
                }}
              >
                <Card.Title>Reviews</Card.Title>
                <ListGroup>
                  {reviews[booklist._id] &&
                    reviews[booklist._id]
                      .filter((review) =>
                        userInfo?.user?.role === 'admin'
                          ? true
                          : review.visibility
                      )
                      .map((review) => (
                        <ListGroup.Item key={review._id}>
                          <strong>From:</strong> {review.userId}{' '}
                          <strong>Review:</strong> {review.review}{' '}
                          {userInfo?.user?.role === 'admin' && (
                            <>
                              <strong>Visibility:</strong>{' '}
                              {review.visibility ? 'Visible' : 'Hidden'}
                              <Button
                                onClick={() =>
                                  handleToggleVisibility(
                                    booklist._id,
                                    review._id,
                                    review.visibility
                                  )
                                }
                                variant="info"
                                style={{ marginLeft: '10px' }}
                              >
                                {review.visibility ? 'Hide' : 'Unhide'}
                              </Button>
                            </>
                          )}
                        </ListGroup.Item>
                      ))}
                </ListGroup>
                {userInfo &&
                  (userInfo.user.role === 'admin' ||
                    userInfo.user.role === 'user') && (
                    <>
                      <Button
                        onClick={() => setShowReviewForm(booklist._id)}
                        variant="success"
                        style={{ marginTop: '10px' }}
                      >
                        Add Review
                      </Button>
                      {showReviewForm === booklist._id && (
                        <ReviewForm booklistId={booklist._id} />
                      )}
                    </>
                  )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ))}
    </Container>
  );
};

export default PublicBooklistsScreen;
