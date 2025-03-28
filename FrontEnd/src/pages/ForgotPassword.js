import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('donor'); // Default to donor
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://aidgenz.onrender.com/api/forgot-password', { email, userType });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error sending reset link.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <div className="p-4 bg-white rounded shadow-sm">
          <h2 className="text-center mb-4">Forgot Password</h2>
          {message && <p className="text-center text-info">{message}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <select className="form-control" value={userType} onChange={(e) => setUserType(e.target.value)} required>
                <option value="donor">Donor</option>
                <option value="orphanage">Orphanage</option>
              </select>
            </div>
            <div className="mb-3">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Send Reset Link
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
