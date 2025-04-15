import React, { useState } from 'react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';

const TransactionUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    if (!file) return alert('Please select an Excel file.');

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const res = await axios.post('http://localhost:5000/api/transactions/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(res.data.message);
    } catch (err) {
      console.error('Upload failed:', err);
      setMessage('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow mt-10">
        <h2 className="text-2xl font-bold mb-4">📥 Upload Customer Transactions</h2>
        <input
          type="file"
          accept=".xlsx"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full border p-2 rounded mb-4"
        />
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {uploading ? 'Uploading...' : 'Upload Transactions'}
        </button>
        {message && <p className="mt-4 text-green-600 font-medium">{message}</p>}
      </div>
    </AdminLayout>
  );
};

export default TransactionUpload;
