import React, { useState } from 'react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';

const CustomerUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    if (!file) return alert('Please select an Excel file to upload.');

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const res = await axios.post('http://localhost:5000/api/customers/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(res.data.message || 'Upload successful');
    } catch (err) {
      setMessage('Upload failed. Check console.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md mt-10">
        <h2 className="text-2xl font-bold mb-4">📥 Upload Customers via Excel</h2>

        <input
          type="file"
          accept=".xlsx"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4 w-full border p-2 rounded"
        />

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>

        {message && <p className="mt-4 text-green-600 font-medium">{message}</p>}
      </div>
    </AdminLayout>
  );
};

export default CustomerUpload;
