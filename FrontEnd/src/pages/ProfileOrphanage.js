import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaBox, FaListAlt, FaHeart } from 'react-icons/fa';
import "../CSS/ProfileOrphanage.css";

const ProfileOrphanage = () => {
  const [orphanage, setOrphanage] = useState(null);
  const [activeDonations, setActiveDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchOrphanageProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('https://aidgenz.onrender.com/api/orphanage/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrphanage(response.data.orphanage);
        setActiveDonations(response.data.activeDonations);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    const fetchOrphanageRequests = async () => {
      try {
        const response = await axios.get('https://aidgenz.onrender.com/api/requests', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRequests(response.data.requests);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchOrphanageProfile();
    fetchOrphanageRequests();
    setLoading(false);
  }, [token]);

  const handleDeleteRequest = async (requestId) => {
    try {
      await axios.delete(`https://aidgenz.onrender.com/api/requests/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRequests((prevRequests) => prevRequests.filter((req) => req._id !== requestId));
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  if (loading) return (
    <div className="loading-screen">
      <div className="loader"></div>
      <p>Loading amazing things...</p>
    </div>
  );
  
  if (!orphanage) return (
    <div className="auth-message">
      <FaHeart className="auth-icon" />
      <h2>Authentication Required</h2>
      <p>Please login to view this profile</p>
      <Link to="/login" className="auth-button">Login Now</Link>
    </div>
  );

  return (
    <div className="modern-profile">
      <header className="profile-hero">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="profile-avatar">
            <img src={orphanage.profileImage || 'default-profile-image.png'} alt={orphanage.name} />
          </div>
          <h1>{orphanage.name}</h1>
          <div className="contact-info">
            <span><FaEnvelope /> {orphanage.email}</span>
            <span><FaMapMarkerAlt /> {orphanage.location}</span>
            <span><FaPhone /> {orphanage.phoneNo}</span>
          </div>
        </motion.div>
      </header>

      <motion.div 
        className="stats-banner"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="stat-item">
          <h3>{activeDonations.length}</h3>
          <p>Active Donations</p>
        </div>
        <div className="stat-item">
          <h3>{requests.length}</h3>
          <p>Open Requests</p>
        </div>
      </motion.div>

      <div className="content-sections">
        <motion.section 
          className="donations"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2><FaBox /> Active Donations</h2>
          <div className="cards-grid">
            {activeDonations.map((donation) => (
              <motion.div 
                key={donation._id}
                className="modern-card"
                whileHover={{ y: -5 }}
              >
                <div className="card-image">
                  {donation.imageUrls?.[0] ? (
                    <img src={donation.imageUrls[0]} alt={donation.itemName} />
                  ) : (
                    <div className="placeholder-image">
                      <FaBox />
                    </div>
                  )}
                </div>
                <div className="card-content">
                  <h3>{donation.itemName}</h3>
                  <p>Quantity: {donation.quantity}</p>
                  {donation.status === 'active' && (
                    <Link to={`/complete-donation/${donation._id}`} className="modern-button">
                      Complete Donation
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section 
          className="requests"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2><FaListAlt /> Current Requests</h2>
          <div className="requests-list">
            {requests.map((request) => (
              <motion.div 
                key={request._id}
                className="request-item"
                whileHover={{ scale: 1.01 }}
              >
                <p>{request.itemNames}</p>
                <button 
                  onClick={() => handleDeleteRequest(request._id)}
                  className="delete-button"
                >
                  Remove
                </button>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default ProfileOrphanage;
