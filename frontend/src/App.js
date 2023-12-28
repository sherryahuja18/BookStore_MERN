// Import statements
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from './screens/HomeScreen';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { Store } from './Store';

import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import SignupScreen from './screens/SignupScreen';
import Button from 'react-bootstrap/Button';
import { getError } from './utils';
import axios from 'axios';
import ViewBookDetails from './screens/ViewBookDetails';
import { UserProvider } from '../src/components/UserContext';
import WishlistScreen from '../src/screens/WishlistScreen';
import BooklistScreen from '../src/screens/MyBooklistScreen';
import PublicBooklistsScreen from '../src/screens/PublicBooklistsScreen';
import AdminDashboard from '../src/screens/AdminDashboard';
import SuccessPage from '../src/screens/SuccessPage';
import EmailVerificationPage from '../src/components/EmailVerificationPage';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { fullBox, cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.reload();
    toast.success('Successfully signed out');
  };

  return (
    <UserProvider>
      <BrowserRouter>
        <div className={fullBox ? 'site-container d-flex flex-column full-box' : 'site-container d-flex flex-column'}>
          <ToastContainer position="bottom-center" limit={1} />
          <header>
            <Navbar bg="dark" variant="dark" expand="lg">
              <Container>
                <LinkContainer to="/">
                  <Navbar.Brand>Book Store</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="me-auto w-100 justify-content-end">
                    {userInfo && (userInfo.user.role === 'admin' || userInfo.user.role === 'user') && (
                      <Link to="/wishlist" className="nav-link">
                        Create Booklist
                      </Link>
                    )}
                    {userInfo && (userInfo.user.role === 'admin' || userInfo.user.role === 'user') && (
                      <Link to="/mybooklists" className="nav-link">
                        My Booklists
                      </Link>
                    )}
                    <Link to="/publicbooklists" className="nav-link">
                      Public Booklists
                    </Link>
                    {userInfo && userInfo.user.role === 'admin' && (
                      <Link to="/admindashboard" className="nav-link">
                        Admin Dashboard
                      </Link>
                    )}
                    {userInfo && (userInfo.user.role === 'admin' || userInfo.user.role === 'user') && (
                      <Link to="/cart" className="nav-link">
                        Cart
                        {/* {cart.cartItems.length > 0 && (
                          <Badge pill bg="danger">
                            {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                          </Badge>
                        )} */}
                      </Link>
                    )}
                    {userInfo ? (
                      <NavDropdown title={`${userInfo.user.fullname}`} id="basic-nav-dropdown">
                        <NavDropdown.Divider />
                        <Link className="dropdown-item" to="#signout" onClick={signoutHandler}>
                          Sign Out
                        </Link>
                      </NavDropdown>
                    ) : (
                      <Link className="nav-link" to="/signin">
                        Sign In
                      </Link>
                    )}
                  </Nav>
                </Navbar.Collapse>
              </Container>
            </Navbar>
          </header>
          <main>
            <Container className="mt-3">
              <Routes>
                <Route path="/cart" element={<CartScreen />} />
                <Route path="/wishlist" element={<WishlistScreen />} />
                <Route path="/mybooklists" element={<BooklistScreen />} />
                <Route path="/publicbooklists" element={<PublicBooklistsScreen />} />
                <Route path="/admindashboard" element={<AdminDashboard />} />
                <Route path="/book/:bookId" element={<ViewBookDetails />} />
                <Route path="/" element={<HomeScreen />} />
                <Route path="/success" element={<SuccessPage />} />
                <Route path="/signup" element={<SignupScreen />} />
                <Route path="/signin" element={<SigninScreen />} />
                <Route path="/auth/verify-email/:token" element={<EmailVerificationPage />} />

              </Routes>
            </Container>
          </main>
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
