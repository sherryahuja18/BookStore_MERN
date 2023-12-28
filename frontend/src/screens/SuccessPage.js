
import React from 'react';
import { useNavigate } from 'react-router-dom';


const SuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Order Successful!</h1>
      <p>Thank you for your purchase.</p>
      {/* Add additional content and styling as needed */}
    </div>
  );
};

export default SuccessPage;
