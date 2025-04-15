import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [customerId, setCustomerId] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
     const res = await axios.post(
  'http://localhost:5000/api/customer-login',
  { customerId, pin },
  {
    headers: {
      'Content-Type': 'application/json',
    },
  }
);

      const { id, role } = res.data;

      // 🔐 Save complete user object in localStorage
      localStorage.setItem('user', JSON.stringify({ id, role }));

      // 🚀 Redirect based on role
      if (role === 'admin') {
        navigate('/dashboard');
      } else if (role === 'owner') {
        navigate('/owner-dashboard');
      } else if (role === 'customer') {
        navigate(`/user/${id}`);
      } else {
        setError('Unknown role. Please contact support.');
      }
    } catch (err) {
      console.error(err);
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Customer ID"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="password"
            placeholder="PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
