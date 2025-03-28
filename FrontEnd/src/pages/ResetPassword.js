import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [userType, setUserType] = useState('donor'); // Default to 'donor'

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send userType as query parameter
      const response = await axios.post(
        `https://aidgenz.onrender.com/api/reset-password/${token}?userType=${userType}`,
        { password }
      );
      setMessage(response.data.message);
      setTimeout(() => navigate('/donor-auth'), 3000); // Redirect to Donor Auth after 3 seconds
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error resetting password.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="p-4 bg-white rounded shadow-sm">
        <h2 className="text-center mb-4">Reset Password</h2>
        {message && <p className="text-center text-info">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="userType" className="form-label">User Type</label>
            <select
              id="userType"
              className="form-select"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <option value="donor">Donor</option>
              <option value="orphanage">Orphanage</option>
            </select>
          </div>

          <input 
            type="password" 
            name="password" 
            placeholder="New Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="form-control mb-3" 
          />
          <button type="submit" className="btn btn-primary w-100">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
