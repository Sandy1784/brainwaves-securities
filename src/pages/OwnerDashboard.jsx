import React, { useState, useEffect } from 'react';
import {
  FaBuilding,
  FaUsers,
  FaClipboardCheck,
  FaGavel,
  FaNewspaper,
} from 'react-icons/fa';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '';

const banks = [
  'ICICI Bank Ltd',
  'HDFC Bank Ltd',
  'Axis Bank Ltd',
  'Kotak Mahindra Bank',
  'Yes Bank Ltd',
];

const OwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Dashboard states
  const [selectedSource, setSelectedSource] = useState('All');
  const [showAllNews, setShowAllNews] = useState(false);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [modalNews, setModalNews] = useState(null);

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

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const [customers, setCustomers] = useState([]);
  const [custLoading, setCustLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'group') {
      fetchCompanies();
    }
  }, [activeTab]);

  const fetchCompanies = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/companies`);
      setCompanies(res.data);
    } catch (err) {
      console.error('Error fetching companies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'customers') {
      fetchCustomers();
    }
  }, [activeTab]);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/customers`);
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

  const handleLiquidate = async (companyId) => {
    const amt = prompt('Enter amount to liquidate:');
    if (!amt) return;
    try {
      await axios.post(`${API_BASE}/api/companies/${companyId}/liquidate`, {
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
      await axios.post(`${API_BASE}/api/companies/${companyId}/add-payee`, {
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
      await axios.post(`${API_BASE}/api/companies/${companyId}/toggle-status`, {
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

  const filteredCompanies = companies.filter(
    (company) =>
      company.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.company_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar and other parts remain unchanged, continue from here... */}
      {/* Sidebar and main layout already loaded above */}

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
                const randomBank = banks[Math.floor(Math.random() * banks.length)];
                const withdraw = company.margin_balance - company.liquidated_balance;
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
                          ₹{Number(company.liquidated_balance).toLocaleString()}
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
                        onClick={() => handleToggleStatus(company.id, company.status)}
                        className={`w-full py-1 rounded-full text-sm font-medium shadow-sm ${
                          company.status === 'active'
                            ? 'bg-gray-400 hover:bg-gray-500 text-white'
                            : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                      >
                        {company.status === 'active' ? 'Deactivate' : 'Activate'}
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

          {/* Modal */}
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
                    <strong>Margin:</strong> ₹{Number(selectedCompany.margin_balance).toLocaleString()}
                  </div>
                  <div>
                    <strong>Liquidated:</strong> ₹{Number(selectedCompany.liquidated_balance).toLocaleString()}
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

      {/* You can continue the customers, requests, and notices sections below similarly */}
    </div>
  );
};

export default OwnerDashboard;
