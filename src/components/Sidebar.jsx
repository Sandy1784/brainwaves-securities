import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-lg h-full fixed top-0 left-0 p-6 hidden md:block">
      <h2 className="text-2xl font-bold text-blue-700 mb-8">Brainwaves Admin</h2>
      <nav className="space-y-4">
        <Link to="/dashboard" className="block text-gray-700 hover:text-blue-600">Dashboard</Link>
        <Link to="/customers" className="block text-gray-700 hover:text-blue-600">Customers</Link>
        <Link to="/upload-transactions" className="block text-gray-700 hover:text-blue-600">Transactions</Link>
        <Link to="/reports" className="block text-gray-700 hover:text-blue-600">Reports</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
