import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCustomer } from '../context/CustomerContext';

const CustomerRoute = ({ children }) => {
  const { customerId } = useCustomer();
  return customerId ? children : <Navigate to="/" />;
};

export default CustomerRoute;
