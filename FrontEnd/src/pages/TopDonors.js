import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import '../CSS/TopDonors.css';

const TOP_DONORS_API_URL = "http://localhost:5000/api/leaderboard/top-donors";

const TopDonors = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopDonors = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get auth token if available
        const authToken = localStorage.getItem('authToken');
        const headers = authToken ? { 'Authorization': `Bearer ${authToken}` } : {};

        const response = await axios.get(TOP_DONORS_API_URL, { headers });
        
        if (response.data && Array.isArray(response.data)) {
          setDonors(response.data);
        } else {
          console.error('Invalid data format received:', response.data);
          setError('Received invalid data format from server');
        }
      } catch (error) {
        console.error('Error fetching top donors:', error);
        setError(error.response?.data?.message || 'Failed to load donors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTopDonors();
  }, []);

  const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading top donors...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Something went wrong</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  if (donors.length === 0) {
    return (
      <div className="empty-state-container">
        <h3>No donors found</h3>
        <p>Be the first to donate and make a difference!</p>
        <Link to="/donor-auth" className="btn btn-primary">
          Start Donating
        </Link>
      </div>
    );
  }

  return (
    <div className="top-donors-container">
      {/* Modern Navbar */}
      <nav className="navbar navbar-expand-lg fixed-top custom-navbar">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            <span className="brand-text">Aid</span>
            <span className="brand-text-highlight">GenZ</span>
          </Link>
          <Link to="/" className="btn btn-outline-primary back-btn">
            <i className="fas fa-arrow-left"></i> Back to Home
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section text-center">
        <div className="container">
          <h1 className="display-4 fw-bold">Our Top Donors</h1>
          <p className="lead">Celebrating those who make a difference in children's lives</p>
        </div>
      </section>

      {/* Top Donors Grid */}
      <section className="donors-grid-section">
        <div className="container">
          <div className="row">
            {donors.map((donor, index) => (
              <div key={donor._id} className="col-md-4 mb-4">
                <div className={`donor-card ${index < 3 ? 'top-three' : ''}`}>
                  {index < 3 && (
                    <div className={`rank-badge rank-${index + 1}`}>
                      {index + 1}
                    </div>
                  )}
                  <div className="donor-avatar">
                    <img 
                      src={donor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(donor.name)}&background=random`} 
                      alt={donor.name}
                    />
                  </div>
                  <div className="donor-info">
                    <h3>{donor.name}</h3>
                    <p className="location">
                      <i className="fas fa-map-marker-alt"></i> {donor.location || 'Global Donor'}
                    </p>
                    <div className="contact-info">
                      {donor.email && (
                        <p className="email">
                          <i className="fas fa-envelope"></i> {donor.email}
                        </p>
                      )}
                      {donor.phone && (
                        <p className="phone">
                          <i className="fas fa-phone"></i> {formatPhoneNumber(donor.phone)}
                        </p>
                      )}
                    </div>
                    <div className="donation-stats">
                      <div className="stat">
                        <span className="stat-value">{donor.totalDonations}</span>
                        <span className="stat-label">Donations</span>
                      </div>
                      <div className="stat">
                        <span className="stat-value">{donor.impactScore}</span>
                        <span className="stat-label">Impact Score</span>
                      </div>
                    </div>
                    <p className="donor-badge">
                      <i className={`fas fa-${getBadgeIcon(donor.impactScore)}`}></i>
                      {getBadgeTitle(donor.impactScore)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section text-center">
        <div className="container">
          <h2>Join Our Community of Donors</h2>
          <p>Make a difference today and become part of our giving community</p>
          <Link to="/donor-auth" className="btn btn-primary btn-lg glow-button">
            Start Donating
          </Link>
        </div>
      </section>
    </div>
  );
};

// Helper functions for badges
const getBadgeIcon = (score) => {
  if (score >= 1000) return 'crown';
  if (score >= 500) return 'star';
  if (score >= 100) return 'heart';
  return 'hand-holding-heart';
};

const getBadgeTitle = (score) => {
  if (score >= 1000) return 'Platinum Donor';
  if (score >= 500) return 'Gold Donor';
  if (score >= 100) return 'Silver Donor';
  return 'Bronze Donor';
};

export default TopDonors;
