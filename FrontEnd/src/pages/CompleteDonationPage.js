import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const CompleteDonationPage = () => {
  const { donationId } = useParams();  // Extract donationId from URL
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [donation, setDonation] = useState(null);  // To store fetched donation details
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Fetch donation details when the page loads
  useEffect(() => {
    const fetchDonationDetails = async () => {
      try {
        const response = await axios.get(`https://aidgenz.onrender.com/api/donations/${donationId}`);
        setDonation(response.data);  // Store donation data in state
      } catch (err) {
        setError('Error fetching donation details');
      }
    };

    fetchDonationDetails();
  }, [donationId]);  // Re-fetch when donationId changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (rating < 1 || rating > 5) {
      setError('Please provide a valid rating (1-5).');
      return;
    }

    try {
      const response = await axios.patch(
        `https://aidgenz.onrender.com/api/orphanage/complete/${donationId}`,
        { rating, comment },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,  // Assuming authorization header
          },
        }
      );
      setSuccessMessage(response.data.message);
      setTimeout(() => {
        navigate("/donations-thread");  // Redirect to the donations thread
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Complete Donation</h2>
      {error && <p className="text-danger">{error}</p>}
      {successMessage && <p className="text-success">{successMessage}</p>}

      {donation && (
        <div>
          <h3>{donation.itemName}</h3>
          <p><strong>Donor:</strong> {donation.donorId.name} ({donation.donorId.email})</p>
          <p><strong>Category:</strong> {donation.category}</p>
          <p><strong>Quantity:</strong> {donation.quantity}</p>
          <p><strong>Status:</strong> {donation.status}</p>
          <p><strong>Booked By:</strong> {donation.bookedBy ? donation.bookedBy.name : 'Not booked yet'}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Rating (1 to 5)</label>
          <input
            type="number"
            className="form-control"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            min="1"
            max="5"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Comment</label>
          <textarea
            className="form-control"
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit Rating & Comment
        </button>
      </form>
    </div>
  );
};

export default CompleteDonationPage;
