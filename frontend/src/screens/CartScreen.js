import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MessageBox from '../components/MessageBox';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { useUserContext } from '../components/UserContext';
import './CartScreen.css';

const baseurl  = 'http://localhost:4000'


const stripePromise = loadStripe(
  'pk_test_51OJ9ozBnSVSW4jmuXoFvgvGFNDyk8HIop00cy3S7NVYk1LMrQo5Uu7cZllgINUWEvlLwuc8PnXt2BzpUAzHELmSg009R2TdUOE'
);

export default function CartScreen() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, userInfo, signIn, signOut } = useUserContext();

  useEffect(() => {
    const fetchCart = async () => {
      if (!userInfo?.user?.email) {
        // If user info or email is not available, do nothing
        return;
      }
      console.log('userinfo from cart page at- ', userInfo);
      try {
        const response = await axios.get(
          `${baseurl}/cart/getusercart/${userInfo.user.email}`
        );
        console.log('Response from server:', response.data);

        setCartItems(response.data.books);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user cart:', error.message);
      }
    };

    fetchCart();
  }, [userInfo]);

  const updateCartHandler = async (bookId, newQuantity) => {
    try {
      let userId = userInfo.user.email;

      const createData = {
        userId,
        bookId,
        quantity: 1,
      };

      await axios.post(`${baseurl}/cart/create`, createData);

      const updatedCartItems = cartItems.map((item) =>
        item.booksId === bookId ? { ...item, quantity: newQuantity } : item
      );

      // Update the local state
      setCartItems(updatedCartItems);
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    } catch (error) {
      console.error('Error updating cart:', error.message);
    }
  };

  const removeItemHandler = async (bookId, deletion) => {
    try {
      let userId = userInfo.user.email;
      const updateData = {
        userId,
        bookId,
        deletion: deletion,
      };

      await axios.post(`${baseurl}/cart/update`, updateData);

      if (deletion === 'partial') {
        setCartItems((prevCartItems) =>
          prevCartItems.map((item) =>
            item.booksId === bookId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
        );
      } else if (deletion === 'full') {
        setCartItems((prevCartItems) =>
          prevCartItems.filter((item) => item.booksId !== bookId)
        );
      }

      const updatedCartItems =
        deletion === 'partial'
          ? cartItems.map((item) =>
              item.booksId === bookId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
          : cartItems.filter((item) => item.booksId !== bookId);

      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    } catch (error) {
      console.error('Error removing item from cart:', error.message);
    }
  };

  const checkoutHandler = async () => {
    try {
      const totalAmount = parseFloat(
        cartItems
          .reduce(
            (total, item) => total + item.quantity * parseFloat(item.price),
            0
          )
          .toFixed(2)
      );
      console.log('total amount', totalAmount);
      const response = await axios.post('${baseurl}/stripe/payment', {
        total: totalAmount,
      });

      const session = response.data;

      const stripe = await stripePromise;
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error(result.error.message);
        alert('An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error.message);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1>Shopping Cart</h1>
      <Row>
        <Col md={8}>
          {loading ? (
            <p>Loading...</p>
          ) : cartItems && cartItems.length === 0 ? (
            <MessageBox>
              Cart is empty. <Link to="/">Go Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((book) => (
                <ListGroup.Item key={book._id}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <div id="main-div">
                        <p>
                          <strong>Title: </strong>
                          {book.title}
                        </p>
                        <p>
                          <strong>Quantity: </strong>
                          {book.quantity}
                        </p>
                        <p>
                          <strong>Price per unit: </strong>
                          {book.price}
                        </p>
                        <p>
                          <img
                            src={book.image}
                            alt={`Image for ${book.title}`}
                          />
                        </p>
                        <Button
                          onClick={() =>
                            removeItemHandler(book.booksId, 'partial')
                          }
                          variant="light"
                          disabled={book.quantity === 1}
                        >
                          -
                        </Button>{' '}
                        <Button
                          variant="light"
                          onClick={() =>
                            updateCartHandler(book.booksId, book.quantity + 1)
                          }
                        >
                          +
                        </Button>
                        <Button
                          onClick={() =>
                            removeItemHandler(book.booksId, 'full')
                          }
                          variant="light"
                        >
                          Remove
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                    items) : $
                    {cartItems
                      .reduce((a, c) => a + c.quantity * parseFloat(c.price), 0)
                      .toFixed(2)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={checkoutHandler}
                      disabled={cartItems.length === 0}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
