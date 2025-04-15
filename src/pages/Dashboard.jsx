import React from 'react';
import AdminLayout from '../components/AdminLayout';

const Dashboard = () => {
  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome, Admin 👋</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-xl p-6">
          <p className="text-sm text-gray-500">Total Investment</p>
          <h2 className="text-2xl font-bold text-blue-700">₹110 Cr</h2>
        </div>
        <div className="bg-white shadow rounded-xl p-6">
          <p className="text-sm text-gray-500">Total Return</p>
          <h2 className="text-2xl font-bold text-green-600">₹85 Cr</h2>
        </div>
        <div className="bg-white shadow rounded-xl p-6">
          <p className="text-sm text-gray-500">Pending Return</p>
          <h2 className="text-2xl font-bold text-yellow-600">₹25 Cr</h2>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
