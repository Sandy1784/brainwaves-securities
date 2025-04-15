import React, { createContext, useContext, useState } from 'react';

const CustomerContext = createContext();

export const useCustomer = () => useContext(CustomerContext);

export const CustomerProvider = ({ children }) => {
  const [customerId, setCustomerId] = useState(localStorage.getItem('customerId'));

  const login = (id) => {
    setCustomerId(id);
    localStorage.setItem('customerId', id);
  };

  const logout = () => {
    setCustomerId(null);
    localStorage.removeItem('customerId');
  };

  return (
    <CustomerContext.Provider value={{ customerId, login, logout }}>
      {children}
    </CustomerContext.Provider>
  );
};
