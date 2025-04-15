import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UserDashboard = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [notices, setNotices] = useState([]);
  const [tab, setTab] = useState('summary');
  const [pinForm, setPinForm] = useState({ oldPin: '', newPin: '', confirmPin: '' });
  const [pinMessage, setPinMessage] = useState('');
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    fetchCustomer();
    fetchTransactions();
    fetchNotices();
  }, [id]);

  const fetchCustomer = async () => {
    const res = await axios.get(`http://localhost:5000/api/customers`);
    const match = res.data.find((c) => c.id === Number(id));
    setCustomer(match);
  };

  const fetchTransactions = async () => {
    const res = await axios.get(`http://localhost:5000/api/customer/${id}/transactions`);
    setTransactions(res.data);
  };

  const fetchNotices = async () => {
    const res = await axios.get(`http://localhost:5000/api/customer/${id}/notices`);
    setNotices(res.data);
  };

  const totalInvested = transactions
    .filter(t => t.transaction_type?.toLowerCase() === 'investment')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const totalWithdrawn = transactions
    .filter(t => t.transaction_type?.toLowerCase() === 'withdrawal')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const totalBalance = totalInvested - totalWithdrawn;

  const handlePinChange = async () => {
    if (pinForm.newPin !== pinForm.confirmPin) {
      setPinMessage("New PIN and Confirm PIN do not match.");
      return;
    }

    if (pinForm.oldPin !== customer.pin) {
      setPinMessage("Incorrect old PIN. Please contact support@brainwavessec.in");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/customers/${id}`, { pin: pinForm.newPin });
      setPinMessage("PIN updated successfully.");
      setCustomer({ ...customer, pin: pinForm.newPin });
      setPinForm({ oldPin: '', newPin: '', confirmPin: '' });
    } catch (err) {
      console.error(err);
      setPinMessage("Error updating PIN.");
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="bg-white rounded-xl p-6 shadow max-w-6xl mx-auto">

        {/* Profile section */}
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
            onClick={() => setShowProfile(true)}
          >
            <span className="text-xl text-gray-600">👤</span>
          </div>
          <div className="text-gray-700">
            <div className="text-sm text-gray-500">Customer ID:</div>
            <div className="text-blue-800 font-bold text-lg">
              {customer ? customer['CUSTOMER ID'] : 'Loading...'}
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-1 text-blue-800">
          Welcome, {customer?.['CUSTOMER NAME'] || ''}
        </h2>
        <p className="text-sm text-gray-600 mb-6">Brainwaves Securities Customer Dashboard</p>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-100 p-4 rounded shadow">
            <p className="text-sm text-gray-700">Total Balance</p>
            <h3 className="text-xl font-bold text-blue-900">₹{totalBalance.toLocaleString()}</h3>
          </div>
          <div className="bg-green-100 p-4 rounded shadow">
            <p className="text-sm text-gray-700">Invested Amount</p>
            <h3 className="text-xl font-bold text-green-900">₹{totalInvested.toLocaleString()}</h3>
          </div>
          <div className="bg-yellow-100 p-4 rounded shadow">
            <p className="text-sm text-gray-700">Withdrawn Amount</p>
            <h3 className="text-xl font-bold text-yellow-900">₹{totalWithdrawn.toLocaleString()}</h3>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b pb-2 mb-4">
          {['summary', 'returns', 'withdrawals', 'investments', 'portfolio', 'edit-pin'].map((t) => (
            <button
              key={t}
              className={`capitalize px-4 py-2 rounded-t ${tab === t ? 'bg-white border-t border-l border-r font-semibold' : 'text-gray-600'}`}
              onClick={() => setTab(t)}
            >
              {t.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        {tab === 'summary' && (
          <div>
            <h4 className="text-lg font-bold mb-2">📢 Brainwaves Notices</h4>
            {notices.length === 0
              ? <p>No notices at this moment.</p>
              : (
                <ul className="list-disc ml-4 text-sm space-y-1">
                  {notices.map((n, i) => (
                    <li key={i}><strong>{n.title}:</strong> {n.content}</li>
                  ))}
                </ul>
              )}
          </div>
        )}

        {tab === 'returns' && (
          <div>
            <h4 className="text-lg font-bold mb-2">Profit Earned</h4>
            <p className="text-green-700 font-semibold">₹{totalBalance.toLocaleString()}</p>
          </div>
        )}

        {tab === 'withdrawals' && (
          <>
            <h4 className="text-lg font-bold mb-2">Withdraw History</h4>
            {transactions.filter(tx => tx.transaction_type?.toLowerCase() === 'withdrawal').length === 0
              ? <p>No withdrawals yet.</p>
              : (
                <ul className="space-y-2">
                  {transactions.filter(tx => tx.transaction_type?.toLowerCase() === 'withdrawal').map((tx, idx) => (
                    <li key={idx} className="border-b pb-2">
                      ₹{tx.amount} on {tx.date} - {tx.status}
                    </li>
                  ))}
                </ul>
              )}
          </>
        )}

        {tab === 'investments' && (
          <>
            <h4 className="text-lg font-bold mb-2">Investment History</h4>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-100 text-left">
                  <th className="p-2">Amount</th>
                  <th>UTR</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Mode</th>
                </tr>
              </thead>
              <tbody>
                {transactions.filter(tx => tx.transaction_type?.toLowerCase() === 'investment').map((tx, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-2">₹{tx.amount}</td>
                    <td>{tx.utr}</td>
                    <td>{tx.date}</td>
                    <td>{tx.status}</td>
                    <td>{tx.mode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {tab === 'portfolio' && (
          <div>
            <h4 className="text-lg font-bold mb-2">Portfolio</h4>
            <p>Coming soon...</p>
          </div>
        )}

        {tab === 'edit-pin' && (
          <div className="space-y-4 max-w-md">
            <h4 className="text-lg font-bold mb-2">Change PIN</h4>
            <input
              type="password"
              placeholder="Current PIN"
              value={pinForm.oldPin}
              onChange={(e) => setPinForm({ ...pinForm, oldPin: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="New PIN"
              value={pinForm.newPin}
              onChange={(e) => setPinForm({ ...pinForm, newPin: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Confirm New PIN"
              value={pinForm.confirmPin}
              onChange={(e) => setPinForm({ ...pinForm, confirmPin: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <button
              onClick={handlePinChange}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Update PIN
            </button>
            {pinMessage && <p className="text-sm text-red-600">{pinMessage}</p>}
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {showProfile && customer && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80">
            <h3 className="text-xl font-bold mb-4">Customer Profile</h3>
            <p><strong>Name:</strong> {customer['CUSTOMER NAME']}</p>
            <p><strong>Email:</strong> {customer['EMAIL ID']}</p>
            <p><strong>Mobile:</strong> {customer['MOBILE NO']}</p>
            <button
              onClick={() => setShowProfile(false)}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
