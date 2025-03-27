import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../CSS/OrphanageProfile.css';
import { motion } from 'framer-motion';

const OrphanageProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDonations: 0,
    activeRequests: 0,
    donorsHelped: 0
  });
  const navigate = useNavigate();
  const [typingText, setTypingText] = useState('');
  const [textIndex, setTextIndex] = useState(0);

  const welcomeTexts = [
    "Together We Create Smiles ❤️",
    "Every Donation Changes Lives 🌟",
    "Be Part of Their Journey 🌈",
    "Making Dreams Come True ✨"
  ];

  const impactMessages = [
    "Your support helps us provide better care",
    "Join our mission to brighten futures",
    "Every contribution makes a difference",
    "Help us create lasting memories"
  ];

  const [currentImpactMessage, setCurrentImpactMessage] = useState(0);

  useEffect(() => {
    let timeout;
    if (textIndex < welcomeTexts[textIndex % welcomeTexts.length].length) {
      timeout = setTimeout(() => {
        setTypingText(prev => prev + welcomeTexts[textIndex % welcomeTexts.length][textIndex]);
        setTextIndex(textIndex + 1);
      }, 100);
    } else {
      timeout = setTimeout(() => {
        setTypingText('');
        setTextIndex(0);
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [textIndex]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('https://aidgenz.onrender.com/api/orphanage/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(response.data);
        // Fetch stats
        const statsResponse = await axios.get('https://aidgenz.onrender.com/api/orphanage/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(statsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        navigate('/orphanage-auth');
      }
    };
    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImpactMessage((prev) => (prev + 1) % impactMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-large"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="orphanage-profile-container">
      {/* Modern Navbar */}
      <nav className="navbar navbar-expand-lg fixed-top custom-navbar">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            <span className="brand-text">Aid</span>
            <span className="brand-text-highlight">GenZ</span>
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/donation-requests">Donation Requests</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/donations-history">History</Link>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-link logout-btn">
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section className="profile-hero">
        <div className="hero-overlay"></div>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="animated-welcome"
          >
            <h1>Welcome, {profile.name}</h1>
            <p className="typing-text">{typingText}<span className="cursor">|</span></p>
            <motion.p 
              key={currentImpactMessage}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="impact-message"
            >
              {impactMessages[currentImpactMessage]}
            </motion.p>
          </motion.div>
        </div>
        <div className="hero-graphics">
          <div className="floating-icon heart">❤️</div>
          <div className="floating-icon star">⭐</div>
          <div className="floating-icon smile">😊</div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="row">
            <motion.div 
              className="col-md-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="stat-card with-gradient">
                <div className="stat-icon-wrapper">
                  <i className="fas fa-gift stat-icon"></i>
                </div>
                <h3>{stats.totalDonations}</h3>
                <p>Total Donations Received</p>
                <div className="progress-bar">
                  <div className="progress" style={{ width: `${Math.min(stats.totalDonations/100 * 100, 100)}%` }}></div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              className="col-md-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="stat-card with-gradient">
                <div className="stat-icon-wrapper">
                  <i className="fas fa-hands-helping stat-icon"></i>
                </div>
                <h3>{stats.activeRequests}</h3>
                <p>Active Requests</p>
                <div className="progress-bar">
                  <div className="progress" style={{ width: `${Math.min(stats.activeRequests/10 * 100, 100)}%` }}></div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              className="col-md-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="stat-card with-gradient">
                <div className="stat-icon-wrapper">
                  <i className="fas fa-users stat-icon"></i>
                </div>
                <h3>{stats.donorsHelped}</h3>
                <p>Donors Helped</p>
                <div className="progress-bar">
                  <div className="progress" style={{ width: `${Math.min(stats.donorsHelped/50 * 100, 100)}%` }}></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Profile Section */}
      <section className="profile-section">
        <div className="container">
          <motion.div 
            className="profile-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="profile-header">
              <div className="profile-image-wrapper">
                <div className="profile-image">
                  <img src={profile.profileImage || 'https://via.placeholder.com/150'} alt={profile.name} />
                </div>
                <div className="profile-status online"></div>
              </div>
              <div className="profile-info">
                <h2>{profile.name}</h2>
                <p className="location">
                  <i className="fas fa-map-marker-alt"></i> {profile.location}
                </p>
                <div className="verification-badge">
                  <i className="fas fa-check-circle"></i> Verified Orphanage
                </div>
              </div>
            </div>
            <div className="profile-details">
              <div className="detail-item">
                <i className="fas fa-envelope"></i>
                <span>{profile.email}</span>
              </div>
              <div className="detail-item">
                <i className="fas fa-phone"></i>
                <span>{profile.phoneNo}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Quick Actions */}
      <section className="actions-section">
        <div className="container">
          <h2 className="section-title">Quick Actions</h2>
          <div className="row">
            <div className="col-md-6">
              <motion.div whileHover={{ scale: 1.03 }}>
                <Link to="/create-request" className="action-card">
                  <div className="action-icon-wrapper">
                    <i className="fas fa-plus-circle"></i>
                  </div>
                  <h3>Create New Request</h3>
                  <p>Request donations for your needs</p>
                  <span className="action-arrow">→</span>
                </Link>
              </motion.div>
            </div>
            <div className="col-md-6">
              <motion.div whileHover={{ scale: 1.03 }}>
                <Link to="/manage-requests" className="action-card">
                  <div className="action-icon-wrapper">
                    <i className="fas fa-tasks"></i>
                  </div>
                  <h3>Manage Requests</h3>
                  <p>View and manage your donation requests</p>
                  <span className="action-arrow">→</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* New Section: Recent Activities */}
      <section className="activities-section">
        <div className="container">
          <h2 className="section-title">Recent Activities</h2>
          <div className="activity-timeline">
            {/* Add your recent activities here */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrphanageProfile; 