import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserContext } from '../components/UserContext';
import {
  Button,
  Card,
  Form,
  Container,
  Row,
  Col,
  Badge,
} from 'react-bootstrap';


const baseurl  = 'http://localhost:4000'

const MyBooklistsScreen = () => {
  const { userInfo } = useUserContext();
  const [booklists, setBooklists] = useState([]);
  const [editingBooklist, setEditingBooklist] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [editingDescription, setEditingDescription] = useState('');
  const [selectedBooks, setSelectedBooks] = useState({});

  useEffect(() => {
    const fetchBooklists = async () => {
      let userid;
      if (userInfo && userInfo.user && userInfo.user.email) {
        userid = userInfo.user.email;
      }

      try {
        const response = await axios.get(
          `${baseurl}/wishlist/getuserbooklists/${userid}`
        );
        setBooklists(response.data);
      } catch (error) {
        console.error('Error fetching user booklists:', error.message);
      }
    };

    fetchBooklists();
  }, []);

  const handleCheckboxChange = (booklistId, checked) => {
    const updatedBooklists = booklists.map((booklist) =>
      booklist._id === booklistId
        ? { ...booklist, isPrivate: checked }
        : booklist
    );
    setBooklists(updatedBooklists);
  };

  const handleBookCheckboxChange = (booklistId, bookId, checked) => {
    const updatedSelectedBooks = {
      ...selectedBooks,
      [bookId]: checked,
    };
    setSelectedBooks(updatedSelectedBooks);
  };

  const handleEditClick = (booklist) => {
    setEditingBooklist(booklist._id);
    setEditingName(booklist.name);
    setEditingDescription(booklist.description);

    // Initialize selectedBooks state with the current books selected in the booklist
    const initialSelectedBooks = {};
    booklist.books.forEach((book) => {
      initialSelectedBooks[book._id] = true;
    });
    setSelectedBooks(initialSelectedBooks);
  };

  const handleSaveEdit = async (
    booklistId,
    newName,
    newDescription,
    isPrivate
  ) => {
    try {
      const selectedBooksData = Object.keys(selectedBooks)
        .filter((bookId) => selectedBooks[bookId])
        .map((bookId) => {
          const selectedBooklist = booklists.find(
            (list) => list._id === booklistId
          );
          const selectedBook = selectedBooklist.books.find(
            (book) => book._id === bookId
          );
          return selectedBook;
        });

      const response = await axios.post(`${baseurl}/wishlist/update/${booklistId}`, {
        name: newName,
        description: newDescription,
        userId: userInfo.user.email,
        books: selectedBooksData,
        isPrivate,
      });

      const updatedBooklists = booklists.map((booklist) =>
        booklist._id === booklistId ? response.data : booklist
      );
      setBooklists(updatedBooklists);
      setEditingBooklist(null);
      setEditingName('');
      setEditingDescription('');
      setSelectedBooks({});
    } catch (error) {
      console.error('Error updating booklist:', error.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingBooklist(null);
    setEditingName('');
    setEditingDescription('');
    setSelectedBooks({});
  };

  const handleDelete = async (booklistId) => {
    try {
      await axios.delete(`${baseurl}/wishlist/delete/${booklistId}`);
      const updatedBooklists = booklists.filter(
        (booklist) => booklist._id !== booklistId
      );
      setBooklists(updatedBooklists);
    } catch (error) {
      console.error('Error deleting booklist:', error.message);
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">My Booklists</h2>
      {booklists.map((booklist) => (
        <Card
          key={booklist._id}
          className="mb-3"
          style={{
            background: 'linear-gradient(to right, #4CAF50, #2196F3)',
            color: 'white',
          }}
        >
          <Card.Body
            style={{ background: 'rgba(255, 255, 255, 0.8)', color: 'black' }}
          >
            {editingBooklist === booklist._id ? (
              <Form>
                <Form.Group controlId="formName">
                  <Form.Label>
                    <b>Title:</b>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formDescription">
                  <Form.Label>
                    <b>Description:</b>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    value={editingDescription}
                    onChange={(e) => setEditingDescription(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formIsPrivate">
                  <Form.Check
                    type="checkbox"
                    label={<b>Is Private</b>}
                    checked={booklist.isPrivate}
                    onChange={(e) =>
                      handleCheckboxChange(booklist._id, e.target.checked)
                    }
                  />
                </Form.Group>
                <Form.Group controlId="formBooks">
                  <Form.Label>
                    <b>Books:</b>
                  </Form.Label>
                  {booklist.books.map((book) => (
                    <Form.Check
                      key={book._id}
                      type="checkbox"
                      label={book.title}
                      checked={selectedBooks[book._id]}
                      onChange={(e) =>
                        handleBookCheckboxChange(
                          booklist._id,
                          book._id,
                          e.target.checked
                        )
                      }
                    />
                  ))}
                </Form.Group>
                <Button
                  variant="success"
                  onClick={() =>
                    handleSaveEdit(
                      booklist._id,
                      editingName,
                      editingDescription,
                      booklist.isPrivate
                    )
                  }
                  style={{ marginRight: '10px' }}
                >
                  Save
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleCancelEdit}
                  className="ml-2"
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(booklist._id)}
                  className="mt-3 w-100"
                >
                  Delete Collection
                </Button>
              </Form>
            ) : (
              <div>
                <Row>
                  <Col md={8}>
                    <h4>{booklist.name}</h4>
                    <p>{booklist.description}</p>
                    <Badge variant={booklist.isPrivate ? 'dark' : 'success'}>
                      {booklist.isPrivate ? 'Private' : 'Public'}
                    </Badge>
                    <label className="mt-3 d-block">
                      <b>Books:</b>
                    </label>
                    <ul className="list-unstyled">
                      {booklist.books.map((book) => (
                        <li
                          key={book._id}
                          className="d-flex align-items-center mb-2"
                        >
                          <span className="mr-2">{book.title}</span>
                          <img
                            src={book.thumbnail}
                            alt={book.title}
                            style={{ width: '50px', height: 'auto' }}
                          />
                        </li>
                      ))}
                    </ul>
                  </Col>
                  <Col md={4} className="text-right">
                    <Button
                      variant="primary"
                      onClick={() => handleEditClick(booklist)}
                      className="w-75 mr-2 mb-2"
                      style={{
                        color: 'white',
                        backgroundColor: '#2196F3',
                        borderColor: '#2196F3',
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = 'black')
                      }
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = '#2196F3')
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(booklist._id)}
                      className="w-75"
                      style={{
                        color: 'white',
                        backgroundColor: '#FF0000',
                        borderColor: '#FF0000',
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = 'black')
                      }
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = '#FF0000')
                      }
                    >
                      Delete
                    </Button>
                  </Col>
                </Row>
              </div>
            )}
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default MyBooklistsScreen;
