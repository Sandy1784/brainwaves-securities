import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AddCustomerModal = ({ onClose, onAdd }) => {
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [newField, setNewField] = useState({ key: '', value: '' });
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/init-customers-form');
        const existing = res.data.fields || [];
        const fieldState = {};
        existing.forEach((f) => (fieldState[f] = ''));
        setFields(existing);
        setFormData(fieldState);
      } catch (err) {
        console.error('Error loading fields:', err);
      }
    };

    fetchFields();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddNewField = () => {
    if (!newField.key.trim()) return;
    setFields([...fields, newField.key.trim()]);
    setFormData((prev) => ({ ...prev, [newField.key.trim()]: newField.value }));
    setNewField({ key: '', value: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/customers', formData);
      onAdd();
      onClose();
    } catch (err) {
      console.error('Error submitting:', err);
    }
  };

  const handleExcelUpload = async () => {
    if (!file) return alert('Please select an Excel file (.xlsx)');

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
      const res = await axios.post('http://localhost:5000/api/customers/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(res.data.message);
      onAdd(); // refresh customers list
      onClose(); // close modal
    } catch (err) {
      alert('Upload failed');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-xl">
        <h3 className="text-lg font-bold mb-4">Add Customer</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field, idx) => (
            <input
              key={idx}
              className="w-full p-2 border rounded"
              placeholder={field}
              value={formData[field] || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
            />
          ))}

          {/* Add New Field */}
          <div className="flex gap-2">
            <input
              className="flex-1 p-2 border rounded"
              placeholder="New field name"
              value={newField.key}
              onChange={(e) => setNewField((prev) => ({ ...prev, key: e.target.value }))}
            />
            <input
              className="flex-1 p-2 border rounded"
              placeholder="New field value"
              value={newField.value}
              onChange={(e) => setNewField((prev) => ({ ...prev, value: e.target.value }))}
            />
            <button
              type="button"
              onClick={handleAddNewField}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              +
            </button>
          </div>

          <div className="flex justify-end gap-4">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
              Save
            </button>
            <button type="button" onClick={onClose} className="text-gray-600">
              Cancel
            </button>
          </div>
        </form>

        <hr className="my-4" />

        {/* Excel Upload Section */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700">📥 Upload Excel File</h4>
          <input
            type="file"
            accept=".xlsx"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleExcelUpload}
            disabled={isUploading}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            {isUploading ? 'Uploading...' : 'Upload Customers via Excel'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCustomerModal;
