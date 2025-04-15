import React from 'react';
import profileImg from '../assets/owner.jpg';

const Header = ({ name, activeTab, setActiveTab }) => {
  const tabs = [
    { key: 'group', label: 'Group of Companies' },
    { key: 'customers', label: 'All Customers' },
    { key: 'approvals', label: 'Approval Requests' },
    { key: 'notices', label: 'SEBI Notices' },
  ];

  return (
    <div className="bg-white shadow border-b border-blue-200">
      {/* Header Top */}
      <div className="max-w-screen-xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-800">Brainwaves Securities</h1>
		 
        <div className="flex items-center gap-3">
		<div className="max-w-screen-xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-800">SEBI Registered Broker:INH0948197261973</h1>
		 
        <div className="flex items-center gap-3">
		
          <span className="text-sm text-gray-700">Hi, {name}</span>
          <img src={profileImg} alt="Owner" className="w-10 h-10 rounded-full border-2 border-blue-700" />
          <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-sm transition">
            Logout
          </button>
        </div>
      </div>

      {/* Tab Nav */}
      <div className="bg-blue-50 border-t border-blue-100">
        <div className="max-w-screen-xl mx-auto px-6 py-3 flex flex-wrap gap-4 justify-start sm:justify-center">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ease-in-out shadow-sm
                ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                    : 'bg-white text-blue-700 border border-blue-300 hover:bg-blue-100'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;
