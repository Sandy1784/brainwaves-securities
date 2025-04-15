import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';

const TransactionUpload = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customer, setCustomer] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    amount: '',
    utr: '',
    mode: '',
    status: '',
    date: '',
    remarks: '',
    transaction_type: 'investment',
  });

  const handleSearch = async () => {
    if (!searchTerm.trim()) return alert('Enter Customer ID or Name');
    try {
      const res = await axios.get('http://localhost:5000/api/customers');
      const match = res.data.find(
        (c) =>
          c['CUSTOMER ID']?.toLowerCase() === searchTerm.toLowerCase() ||
          c['CUSTOMER NAME']?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (match) {
        setCustomer(match);
        fetchTransactions(match.id);
      } else {
        alert('Customer not found');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTransactions = async (customerId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/customer/${customerId}/transactions`);
      setTransactions(res.data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customer) return;

    try {
      await axios.post(
        `http://localhost:5000/api/customer/${customer.id}/transactions`,
        form,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      fetchTransactions(customer.id); // refresh after insert
      alert('Transaction added');
      setForm({
        amount: '',
        utr: '',
        mode: '',
        status: '',
        date: '',
        remarks: '',
        transaction_type: 'investment',
      });
    } catch (err) {
      console.error(err);
      alert('Failed to add transaction');
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-md mt-10">
        <h2 className="text-2xl font-bold mb-4">🔍 Search Customer for Transaction Entry</h2>

        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Enter Customer ID or Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 flex-1 rounded"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Search
          </button>
        </div>

        {customer && (
          <>
            <h3 className="text-xl font-semibold mb-2">
              ➕ Add Transaction for {customer['CUSTOMER NAME']} ({customer['CUSTOMER ID']})
            </h3>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6">
              <input
                type="number"
                placeholder="Amount"
                value={form.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className="p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="UTR"
                value={form.utr}
                onChange={(e) => handleInputChange('utr', e.target.value)}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Mode"
                value={form.mode}
                onChange={(e) => handleInputChange('mode', e.target.value)}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Status"
                value={form.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="p-2 border rounded"
              />
              <input
                type="date"
                value={form.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="p-2 border rounded"
              />
              <select
                value={form.transaction_type}
                onChange={(e) => handleInputChange('transaction_type', e.target.value)}
                className="p-2 border rounded"
              >
                <option value="investment">Investment</option>
                <option value="withdrawal">Withdrawal</option>
              </select>
              <textarea
                placeholder="Remarks"
                value={form.remarks}
                onChange={(e) => handleInputChange('remarks', e.target.value)}
                className="col-span-2 p-2 border rounded"
              />
              <button
                type="submit"
                className="col-span-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Add Transaction
              </button>
            </form>

            <h4 className="text-lg font-bold mb-2">📜 Transaction History</h4>
            {transactions.length === 0 ? (
              <p>No transactions yet.</p>
            ) : (
              <table className="w-full table-auto border text-sm">
                <thead className="bg-blue-100 text-gray-800">
                  <tr>
                    <th className="p-2">Date</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>UTR</th>
                    <th>Mode</th>
                    <th>Status</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2">{tx.date || '-'}</td>
                      <td>{tx.transaction_type}</td>
                      <td>₹{tx.amount}</td>
                      <td>{tx.utr}</td>
                      <td>{tx.mode}</td>
                      <td>{tx.status}</td>
                      <td>{tx.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default TransactionUpload;
