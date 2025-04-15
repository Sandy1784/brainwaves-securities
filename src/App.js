import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Customers from './pages/Customers';
import CustomerUpload from './pages/CustomerUpload';
import TransactionUpload from './pages/TransactionUpload'; // ✅ newly added
import UserDashboard from './pages/UserDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import CustomerRoute from './components/CustomerRoute';
import { AuthProvider } from './context/AuthContext';
import { CustomerProvider } from './context/CustomerContext';
import OwnerDashboard from './pages/OwnerDashboard'; // ✅ Correct path based on your folder structure


function App() {
  return (
    <AuthProvider>
      <CustomerProvider>
        <Router>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Login />} />

            {/* Admin */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Customers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload-customers"
              element={
                <ProtectedRoute>
                  <CustomerUpload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload-transactions"
              element={
                <ProtectedRoute>
                  <TransactionUpload />
                </ProtectedRoute>
              }
            />

            {/* Customer */}
            <Route
              path="/user/:id"
              element={
                <CustomerRoute>
                  <UserDashboard />
                </CustomerRoute>
              }
            />
			<Route
				path="/owner-dashboard"
				element={
				<ProtectedRoute>
				<OwnerDashboard />
				</ProtectedRoute>
				}
			/>
          </Routes>
        </Router>
      </CustomerProvider>
    </AuthProvider>
  );
}

export default App;
