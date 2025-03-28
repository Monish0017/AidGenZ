import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ProfileDonor.css"; // We'll create this CSS file for additional styling

const ProfileDonor = () => {
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) {
      navigate("/donor-auth"); // Redirect to login if no token
      return;
    }

    const fetchDonorProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/donor/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200 && response.data) {
          setDonor(response.data);
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (err) {
        console.error("Error fetching donor profile:", err);
        setError("Failed to fetch donor profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDonorProfile();
  }, [token, navigate]);

  // Function to delete a donation
  const handleDeleteDonation = async (donationId) => {
    if (!window.confirm("Are you sure you want to delete this donation?")) return;

    try {
      const response = await axios.delete(`http://localhost:5000/api/donations/delete-donation/${donationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setDonor((prevDonor) => ({
          ...prevDonor,
          donations: prevDonor.donations.filter((donation) => donation._id !== donationId),
        }));
      }
    } catch (err) {
      console.error("Error deleting donation:", err);
      alert("Failed to delete donation. Please try again.");
    }
  };

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!donor) {
    return <div className="empty-state">No donor data available.</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Donor Profile</h2>
        <p className="subtitle">Your donation journey with AidGenZ</p>
      </div>
      
      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="profile-image-container">
            <img
              src={donor.donor.profileImage || "/default-profile-image.png"}
              alt="Profile"
              className="profile-image"
            />
          </div>
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">{donor.donations?.length || 0}</span>
              <span className="stat-label">Donations</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{donor.donor.points || 0}</span>
              <span className="stat-label">Credits</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{donor.acceptedRequests?.length || 0}</span>
              <span className="stat-label">Requests</span>
            </div>
          </div>
        </div>
        
        <div className="profile-main">
          <div className="profile-card">
            <h3 className="card-title">Personal Information</h3>
            <div className="info-row">
              <div className="info-label">Name</div>
              <div className="info-value">{donor.donor.name}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Email</div>
              <div className="info-value">{donor.donor.email}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Location</div>
              <div className="info-value">{donor.donor.location || "Not provided"}</div>
            </div>
            <div className="info-row">
              <div className="info-label">Phone</div>
              <div className="info-value">{donor.donor.phoneNo || "Not provided"}</div>
            </div>
          </div>

          {/* Recent Donations */}
          <div className="profile-card">
            <h3 className="card-title">Recent Donations</h3>
            {donor.donations && donor.donations.length > 0 ? (
              <ul className="activity-list">
                {donor.donations.slice(0, 3).map((donation, index) => (
                  <li key={index} className="activity-item">
                    <div className="activity-icon">📦</div>
                    <div className="activity-details">
                      <span className="activity-title">{donation.itemName}</span>
                      <span className="activity-meta">Quantity: {donation.quantity}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-message">No recent donations.</p>
            )}
          </div>

          {/* Accepted Requests */}
          <div className="profile-card">
            <h3 className="card-title">Accepted Requests</h3>
            {donor.acceptedRequests && donor.acceptedRequests.length > 0 ? (
              <div className="request-list">
                {donor.acceptedRequests.map((request, index) => (
                  <div key={index} className="request-item">
                    <div className="request-header">
                      <span className="request-title">{request.name}</span>
                      <span className={`request-badge ${request.urgency.toLowerCase()}`}>{request.urgency}</span>
                    </div>
                    <div className="request-details">
                      <div className="request-detail">
                        <span className="detail-label">Phone:</span>
                        <span className="detail-value">{request.phoneNo}</span>
                      </div>
                      <div className="request-detail">
                        <span className="detail-label">Items:</span>
                        <span className="detail-value">{Array.isArray(request.itemsNeeded) ? request.itemsNeeded.join(", ") : "No items listed"}</span>
                      </div>
                      <div className="request-detail">
                        <span className="detail-label">Status:</span>
                        <span className="detail-value status-badge">{request.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">No accepted requests.</p>
            )}
          </div>
          
          {/* All Donations */}
          <div className="profile-card">
            <h3 className="card-title">All Donations</h3>
            {donor.donations && donor.donations.length > 0 ? (
              <div className="donation-grid">
                {donor.donations.map((donation) => (
                  <div key={donation._id} className="donation-card">
                    <div className="donation-image-container">
                      {donation.imageUrls && donation.imageUrls.length > 0 ? (
                        <img
                          src={donation.imageUrls[0]}
                          alt={donation.itemName}
                          className="donation-image"
                        />
                      ) : (
                        <div className="donation-image-placeholder">No Image</div>
                      )}
                      <div className="donation-status-badge">{donation.status}</div>
                    </div>
                    <div className="donation-content">
                      <h4 className="donation-title">{donation.itemName}</h4>
                      <div className="donation-details">
                        <span className="donation-category">{donation.category}</span>
                        <span className="donation-quantity">Qty: {donation.quantity}</span>
                      </div>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteDonation(donation._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">No donations found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDonor;
