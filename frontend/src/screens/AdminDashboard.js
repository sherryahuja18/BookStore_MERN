import React, { useEffect, useState } from 'react';
import axios from 'axios';

const baseurl  = 'http://localhost:4000'

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${baseurl}/users/admin`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleToggleActive = async (userId) => {
    try {
      // Update the isActive field in the backend
      await axios.put(`${baseurl}/users/admin/${userId}/toggle-active`);

      // Update the state to reflect the change
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isActive: !user.isActive } : user
        )
      );
    } catch (error) {
      console.error('Error toggling isActive:', error);
    }
  };

  const handleToggleRole = async (userId) => {
    try {
      // Update the role field in the backend
      await axios.put(`${baseurl}/users/admin/${userId}/toggle-role`);

      // Update the state to reflect the change
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId
            ? { ...user, role: user.role === 'user' ? 'admin' : 'user' }
            : user
        )
      );
    } catch (error) {
      console.error('Error toggling role:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Admin Dashboard</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} style={styles.row}>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.isActive ? 'Yes' : 'No'}</td>
              <td>
                <button
                  style={styles.activeButton}
                  onClick={() => handleToggleActive(user._id)}
                >
                  Toggle Active
                </button>
                <button
                  style={styles.roleButton}
                  onClick={() => handleToggleRole(user._id)}
                >
                  Toggle Role
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    margin: '20px',
  },
  heading: {
    color: '#333',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  row: {
    borderBottom: '1px solid #ddd',
  },
  activeButton: {
    padding: '8px 12px',
    margin: '4px',
    cursor: 'pointer',
    background: 'linear-gradient(45deg, #4CAF50, #2196F3)',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
  },
  roleButton: {
    padding: '8px 12px',
    margin: '4px',
    cursor: 'pointer',
    background: 'linear-gradient(45deg, #FFC107, #FF5722)',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
  },
};

export default AdminDashboard;
