import React, { useState } from 'react';
import axios from 'axios';

const RequestDonation = () => {
  const [formData, setFormData] = useState({
    items: '',
    urgency: '',
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken'); // Get token from localStorage

    if (!token) {
      setError('You must be logged in to request a donation.');
      return;
    }

    try {
      const response = await axios.post(
        'https://aidgenz.onrender.com/api/orphanage/request-donation',
        {
          items: formData.items.split(','),
          urgency: formData.urgency,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        }
      );
      setSuccessMessage(response.data.message);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong');
      setSuccessMessage(null);
    }
  };

  return (
    <div className="container">
      <h2 className="mt-4">Request Donation</h2>
      {error && <p className="text-danger">{error}</p>}
      {successMessage && <p className="text-success">{successMessage}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <textarea
            name="items"
            placeholder="Enter the items you need (separate by commas)"
            value={formData.items}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <select
            name="urgency"
            value={formData.urgency}
            onChange={handleChange}
            required
            className="form-control"
          >
            <option value="">Select Urgency</option>
            <option value="urgent">urgent</option>
            <option value="moderate">moderate</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Submit Request</button>
      </form>
    </div>
  );
};

export default RequestDonation;
