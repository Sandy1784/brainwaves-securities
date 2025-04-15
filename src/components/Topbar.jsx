import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Topbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth).then(() => navigate('/'));
  };

  return (
    <div className="bg-white shadow-sm h-16 flex items-center justify-between px-6 fixed top-0 left-64 right-0 z-10">
      <h1 className="text-xl font-semibold text-blue-700">Admin Panel</h1>
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Topbar;
