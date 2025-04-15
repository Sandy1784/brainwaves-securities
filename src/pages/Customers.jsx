import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';
import AddCustomerModal from '../components/AddCustomerModal';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({});
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/customers');
      setCustomers(res.data);
      setFilteredCustomers(res.data);
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    let filtered = [...customers];

    // Apply search
    if (search) {
      filtered = filtered.filter((c) => {
        const name = c["CUSTOMER NAME"]?.toLowerCase() || '';
        const mobile = c["MOBILE NO"]?.toLowerCase() || '';
        return (
          name.includes(search.toLowerCase()) ||
          mobile.includes(search.toLowerCase())
        );
      });
    }

    // Apply sorting
    if (sortField) {
      filtered.sort((a, b) => {
        const aVal = a[sortField] || '';
        const bVal = b[sortField] || '';
        return sortOrder === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      });
    }

    setFilteredCustomers(filtered);
  }, [search, customers, sortField, sortOrder]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData(customer);
  };

  const handleUpdate = async () => {
    try {
      const id = editingCustomer.id;
      await axios.put(`http://localhost:5000/api/customers/${id}`, formData);
      setEditingCustomer(null);
      fetchCustomers();
    } catch (err) {
      console.error('Error updating customer:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await axios.delete(`http://localhost:5000/api/customers/${id}`);
        fetchCustomers();
      } catch (err) {
        console.error('Error deleting customer:', err);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Customer Management</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by name or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded w-full sm:w-64"
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => setShowModal(true)}
          >
            + Add Customer
          </button>
        </div>
      </div>

      {showModal && (
        <AddCustomerModal onClose={() => setShowModal(false)} onAdd={fetchCustomers} />
      )}

      {editingCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg space-y-4">
            <h3 className="text-lg font-bold mb-2">Edit Customer</h3>
            {Object.entries(formData).map(([key, value], idx) => (
              <input
                key={idx}
                className="w-full p-2 border rounded"
                placeholder={key}
                value={value || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, [key]: e.target.value }))}
              />
            ))}
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setEditingCustomer(null)}
                className="text-gray-500 hover:text-black"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="min-w-full table-auto text-left text-sm">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th  className="px-6 py-3 cursor-pointer" 
			       onClick={() => toggleSort("CUSTOMER ID")}>
                   Customer ID {sortField === "CUSTOMER ID" && (sortOrder === 'asc' ? '↑' : '↓')}
             </th>

              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => toggleSort("CUSTOMER NAME")}
              >
                Customer Name {sortField === "CUSTOMER NAME" && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => toggleSort("MOBILE NO")}
              >
                Mobile No {sortField === "MOBILE NO" && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => toggleSort("EMAIL ID")}
              >
                Email ID {sortField === "EMAIL ID" && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3">Bank Name</th>
              <th className="px-6 py-3 cursor-pointer"
                  onClick={() => toggleSort("BRANCH NAME")}>
                  Branch {sortField === "BRANCH NAME" && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{c["CUSTOMER ID"] || '-'}</td>
                <td className="px-6 py-4">{c["CUSTOMER NAME"] || '-'}</td>
                <td className="px-6 py-4">{c["MOBILE NO"] || '-'}</td>
                <td className="px-6 py-4">{c["EMAIL ID"] || '-'}</td>
                <td className="px-6 py-4">{c["BANK NAME"] || '-'}</td>
                <td className="px-6 py-4">{c["BRANCH NAME"] || '-'}</td>
                <td className="px-6 py-4 flex gap-3 text-sm">
                  <button onClick={() => handleEdit(c)} className="text-blue-600 hover:underline">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default Customers;
