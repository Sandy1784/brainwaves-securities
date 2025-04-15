import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full min-h-screen bg-gray-100">
        <Topbar />
        <main className="pt-20 px-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
