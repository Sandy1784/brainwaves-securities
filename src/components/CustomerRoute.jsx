import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const CustomerRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();

  // Allow only if the user exists and has role 'customer'
  if (!user || user.role !== 'customer') {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
};

export default CustomerRoute;