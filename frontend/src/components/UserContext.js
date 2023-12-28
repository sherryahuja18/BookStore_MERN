import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Check if userInfo exists in localStorage
    const storedUserInfo = localStorage.getItem('userInfo');

    if (storedUserInfo) {
      // If userInfo exists, parse and set it in the state
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  const isAuthenticated = !!userInfo; 
  console.log('isAuthenticated - ',isAuthenticated);

  const signIn = (userInfo) => {
    // Save userInfo in localStorage
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    // Set userInfo in the state
    setUserInfo(userInfo);
  };

  const signOut = () => {
    // Remove userInfo from localStorage
    localStorage.removeItem('userInfo');
    // Clear userInfo from the state
    setUserInfo(null);
  };

  const contextValue = {
    userInfo,
    isAuthenticated,
    signIn,
    signOut,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};
