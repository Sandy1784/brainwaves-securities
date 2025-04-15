import React, { useState, useEffect } from 'react';
import {
  FaBuilding,
  FaUsers,
  FaClipboardCheck,
  FaGavel,
  FaNewspaper,
} from 'react-icons/fa';
import axios from 'axios';

const banks = [
  'ICICI Bank Ltd',
  'HDFC Bank Ltd',
  'Axis Bank Ltd',
  'Kotak Mahindra Bank',
  'Yes Bank Ltd',
];

const OwnerDashboard = () => {
  // Sidebar / Tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // ---------- Dashboard States ----------
  const [selectedSource, setSelectedSource] = useState('All');
  const [showAllNews, setShowAllNews] = useState(false);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [modalNews, setModalNews] = useState(null);

  // Dummy news for Dashboard
  const sebiNewsAll = [
    { title: 'SEBI Eases Buyback Rules', date: '15 Apr 2025', source: 'SEBI' },
    { title: 'NSE F&O Segment Hits Record Volume', date: '15 Apr 2025', source: 'NSE' },
    { title: 'BSE SME Platform Crosses 450 Listings', date: '15 Apr 2025', source: 'BSE' },
    { title: 'SEBI Warns Unregistered Advisers', date: '14 Apr 2025', source: 'SEBI' },
    { title: 'NSE Reduces Tick Size for Select Derivatives', date: '13 Apr 2025', source: 'NSE' },
    { title: 'BSE to Introduce Commodities Trading', date: '13 Apr 2025', source: 'BSE' },
  ];
  const visibleNews = sebiNewsAll.slice(0, 3);
  const remainingNews = sebiNewsAll.slice(3);

  // ---------- Group of Companies States ----------
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  // ---------- Customers States ----------
  const [customers, setCustomers] = useState([]);
  const [custLoading, setCustLoading] = useState(true);

  // Fetch Group of Companies
  useEffect(() => {
    if (activeTab === 'group') {
      fetchCompanies();
    }
  }, [activeTab]);

  const fetchCompanies = async () => {
    try {
      const res = await axios.get('/api/companies');
      setCompanies(res.data);
    } catch (err) {
      console.error('Error fetching companies:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Customers
  useEffect(() => {
    if (activeTab === 'customers') {
      fetchCustomers();
    }
  }, [activeTab]);

  const fetchCustomers = async () => {
  try {
    const res = await axios.get('/api/customers');
    console.log('Fetched Customers:', res.data);

    // Adjust based on API shape
    const customerArray = Array.isArray(res.data)
      ? res.data
      : res.data.customers;

    setCustomers(customerArray);
  } catch (err) {
    console.error('Error fetching customers:', err);
    setCustomers([]);
  } finally {
    setCustLoading(false);
  }
};


  // ---------- Group of Companies Actions ----------
  const handleLiquidate = async (companyId) => {
    const amt = prompt('Enter amount to liquidate:');
    if (!amt) return;
    try {
      await axios.post(`/api/companies/${companyId}/liquidate`, {
        amount: Number(amt),
      });
      alert('Liquidation successful');
      fetchCompanies();
    } catch (err) {
      alert('Failed to liquidate');
    }
  };

  const handleAddPayee = async (companyId) => {
    const payeeName = prompt('Enter payee name:');
    const payeeAccount = prompt('Enter payee account:');
    const ifsc = prompt('Enter IFSC code:');
    if (!payeeName || !payeeAccount || !ifsc) return;
    try {
      await axios.post(`/api/companies/${companyId}/add-payee`, {
        payeeName,
        payeeAccount,
        ifsc,
      });
      alert('Payee added successfully');
    } catch (err) {
      alert('Failed to add payee');
    }
  };

  const handleToggleStatus = async (companyId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await axios.post(`/api/companies/${companyId}/toggle-status`, {
        status: newStatus,
      });
      fetchCompanies();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleViewDetails = (companyId) => {
    const company = companies.find((c) => c.id === companyId);
    setSelectedCompany(company);
    setShowModal(true);
  };

  // Filter for Group of Companies
  const filteredCompanies = companies.filter(
    (company) =>
      company.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.company_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col py-6 px-4">
        <div className="mb-6">
  <div className="text-2xl font-bold text-white">
    Brainwaves Securities
  </div>
  <div className="text-xs text-gray-400 mt-1">
    Sebi Registered Broker: INZ000251924
  </div>
</div>

        <nav className="space-y-3">
          {[
            { key: 'dashboard', label: 'Dashboard', icon: <FaNewspaper /> },
            { key: 'group', label: 'Group of Companies', icon: <FaBuilding /> },
            { key: 'customers', label: 'Customers', icon: <FaUsers /> },
            { key: 'requests', label: 'Requests (3)', icon: <FaClipboardCheck /> },
            { key: 'notices', label: 'Notices', icon: <FaGavel /> },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                activeTab === tab.key ? 'bg-blue-600' : 'hover:bg-gray-800'
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto pt-6 border-t border-gray-700 text-sm text-gray-300">
          <div className="font-semibold">Mr. Sandip Patil</div>
          <div className="text-xs text-gray-400">
            MD &amp; CEO, Group of Companies
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* ---------- DASHBOARD TAB ---------- */}
        {activeTab === 'dashboard' && (
          <div className="max-w-screen-xl mx-auto">
            {/* Dashboard Header */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold text-yellow-600 uppercase">
                Dashboard
              </span>
              <span className="text-sm text-gray-500">
                Welcome Mr. Sandip Patil
              </span>
            </div>

            {/* Total Balance */}
            <div className="bg-white p-6 rounded-lg shadow mb-6 border-l-8 border-yellow-500">
              <h3 className="text-sm text-gray-500 mb-1">Total Balance</h3>
              <p className="text-3xl font-bold text-blue-800">
                ₹25,980,000,000.00
              </p>
            </div>

            <hr className="border-t border-gray-300 my-8" />

            {/* News Section */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-blue-800">
                Latest Market News
              </h2>
              <div className="space-x-2">
                {['All', 'SEBI', 'NSE', 'BSE'].map((src) => (
                  <button
                    key={src}
                    onClick={() => setSelectedSource(src)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      selectedSource === src
                        ? 'bg-blue-600 text-white shadow'
                        : 'bg-white border border-blue-400 text-blue-700 hover:bg-blue-50'
                    }`}
                  >
                    {src}
                  </button>
                ))}
              </div>
            </div>

            {/* Today's News */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-600 mb-2">
                Today
              </h4>
              {visibleNews
                .filter((news) =>
                  selectedSource === 'All'
                    ? true
                    : news.source === selectedSource
                )
                .map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setModalNews(item);
                      setShowNewsModal(true);
                    }}
                    className="cursor-pointer bg-white border-l-4 border-blue-500 p-4 mb-3 rounded shadow hover:bg-blue-50 transition"
                  >
                    <div className="text-sm font-medium text-blue-800 hover:underline">
                      {item.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.source} • {item.date}
                    </div>
                  </div>
                ))}
            </div>

            {/* Load More */}
            {!showAllNews && (
              <div className="text-center mb-10">
                <button
                  onClick={() => setShowAllNews(true)}
                  className="px-4 py-1 rounded-full bg-blue-700 text-white hover:bg-blue-800 text-sm font-medium"
                >
                  Load More
                </button>
              </div>
            )}

            {/* Earlier News */}
            {showAllNews && (
              <div className="mb-10">
                <h4 className="text-sm font-semibold text-gray-600 mb-2">
                  Earlier This Week
                </h4>
                {remainingNews
                  .filter((news) =>
                    selectedSource === 'All'
                      ? true
                      : news.source === selectedSource
                  )
                  .map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setModalNews(item);
                        setShowNewsModal(true);
                      }}
                      className="cursor-pointer bg-gray-50 border-l-4 border-gray-300 p-4 mb-3 rounded hover:bg-gray-100 transition"
                    >
                      <div className="text-sm font-medium text-gray-800 hover:underline">
                        {item.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.source} • {item.date}
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* News Modal */}
            {showNewsModal && modalNews && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
                  <button
                    className="absolute top-2 right-4 text-2xl text-gray-400 hover:text-gray-700"
                    onClick={() => setShowNewsModal(false)}
                  >
                    &times;
                  </button>
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">
                    {modalNews.title}
                  </h3>
                  <div className="text-sm text-gray-600 mb-1">
                    Source: {modalNews.source}
                  </div>
                  <div className="text-xs text-gray-400">
                    Published: {modalNews.date}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---------- GROUP OF COMPANIES TAB ---------- */}
        {activeTab === 'group' && (
          <>
            <h2 className="text-2xl font-semibold text-blue-800 mb-6">
              Group of Companies
            </h2>
            <input
              type="text"
              placeholder="Search by name or type..."
              className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {loading ? (
              <p className="text-gray-500 text-center">Loading companies...</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredCompanies.map((company) => {
                  const randomBank =
                    banks[Math.floor(Math.random() * banks.length)];
                  const withdraw =
                    company.margin_balance - company.liquidated_balance;
                  return (
                    <div
                      key={company.id}
                      className="bg-white border border-blue-300 rounded-2xl shadow-sm p-5 hover:shadow-xl hover:scale-[1.02] transition-transform duration-200"
                    >
                      <div className="text-xs text-right text-blue-600 font-medium mb-1">
                        {randomBank}
                      </div>
                      <h3 className="text-lg font-semibold text-blue-800">
                        {company.company_name}
                      </h3>
                      <p className="text-xs text-gray-500 mb-3">
                        {company.company_type}
                      </p>
                      <div className="flex justify-between text-sm text-gray-700 mb-4">
                        <div>
                          <p className="font-medium">Margin</p>
                          <p className="text-blue-800">
                            ₹{Number(company.margin_balance).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Liquidated</p>
                          <p className="text-green-700">
                            ₹
                            {Number(
                              company.liquidated_balance
                            ).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Withdraw</p>
                          <p className="text-red-600">
                            ₹{Number(withdraw).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="mb-3">
                        <button
                          onClick={() =>
                            handleToggleStatus(company.id, company.status)
                          }
                          className={`w-full py-1 rounded-full text-sm font-medium shadow-sm ${
                            company.status === 'active'
                              ? 'bg-gray-400 hover:bg-gray-500 text-white'
                              : 'bg-green-500 hover:bg-green-600 text-white'
                          }`}
                        >
                          {company.status === 'active'
                            ? 'Deactivate'
                            : 'Activate'}
                        </button>
                      </div>
                      <div className="flex gap-2 mb-2">
                        <button
                          onClick={() => handleLiquidate(company.id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1 rounded-full text-sm font-medium shadow-sm"
                        >
                          Liquidate
                        </button>
                        <button
                          onClick={() => handleAddPayee(company.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1 rounded-full text-sm font-medium shadow-sm"
                        >
                          Add Payee
                        </button>
                      </div>
                      <button
                        onClick={() => handleViewDetails(company.id)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1 rounded-full text-sm font-medium shadow-sm"
                      >
                        View Details
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            {showModal && selectedCompany && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-full max-w-xl shadow-xl relative">
                  <button
                    className="absolute top-2 right-4 text-gray-500 hover:text-gray-800 text-2xl"
                    onClick={() => setShowModal(false)}
                  >
                    &times;
                  </button>
                  <h2 className="text-xl font-semibold text-blue-800 mb-2">
                    {selectedCompany.company_name}
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">
                    {selectedCompany.company_type}
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                      <strong>Margin:</strong> ₹
                      {Number(
                        selectedCompany.margin_balance
                      ).toLocaleString()}
                    </div>
                    <div>
                      <strong>Liquidated:</strong> ₹
                      {Number(
                        selectedCompany.liquidated_balance
                      ).toLocaleString()}
                    </div>
                    <div>
                      <strong>Status:</strong> {selectedCompany.status}
                    </div>
                    <div>
                      <strong>ID:</strong> {selectedCompany.id}
                    </div>
                  </div>
                  <div className="mt-6 text-right">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full text-sm"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ---------- CUSTOMERS TAB ---------- */}
{activeTab === 'customers' && (
  <div className="max-w-screen-xl mx-auto">
    <h2 className="text-2xl font-semibold text-blue-800 mb-6">
      Customer Management
    </h2>
    {custLoading ? (
      <p className="text-gray-500 text-center">Loading customers...</p>
    ) : customers.length === 0 ? (
      <p className="text-gray-500 text-center">No customers found.</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Customer ID</th>
              <th className="px-4 py-2 border">Customer Name</th>
              <th className="px-4 py-2 border">Mobile No</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Bank Name</th>
              <th className="px-4 py-2 border">Branch</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((cust) => (
              <tr key={cust.id} className="text-center">
                <td className="px-4 py-2 border">{cust["CUSTOMER ID"]}</td>
                <td className="px-4 py-2 border">{cust["CUSTOMER NAME"]}</td>
                <td className="px-4 py-2 border">{cust["MOBILE NO"]}</td>
                <td className="px-4 py-2 border">{cust["EMAIL ID"]}</td>
                <td className="px-4 py-2 border">{cust["BANK NAME"]}</td>
                <td className="px-4 py-2 border">{cust["BRANCH NAME"]}</td>
                <td className="px-4 py-2 border">
                  <button className="text-blue-600 hover:underline">
                    Edit
                  </button>{' '}
                  |{' '}
                  <button className="text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)}


        {/* ---------- REQUESTS TAB ---------- */}
        {activeTab === 'requests' && (
          <div className="text-gray-700 text-lg text-center pt-20">
            Request Approval Section coming soon...
          </div>
        )}

        {/* ---------- NOTICES TAB ---------- */}
        {activeTab === 'notices' && (
          <div className="text-gray-700 text-lg text-center pt-20">
            SEBI/Compliance Notices will appear here.
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
