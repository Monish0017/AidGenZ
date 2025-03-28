import { useState } from "react";
import axios from "axios";
import { useNavigate, NavLink, Link } from "react-router-dom";
import "../CSS/Auth.css";  // Update this line

const DonorAuth = () => {
  const [isRegister, setIsRegister] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    phoneNo: "",
    profileImage: null,
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const apiUrl = isRegister 
      ? "https://aidgenz.onrender.com/api/donor/register" 
      : "https://aidgenz.onrender.com/api/donor/login";
    
    let formDataToSend;

    if (isRegister) {
      formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key !== "profileImage") {
          formDataToSend.append(key, formData[key]);
        }
      });
      if (formData.profileImage) {
        formDataToSend.append("profileImage", formData.profileImage);
      }
    } else {
      formDataToSend = {
        email: formData.email,
        password: formData.password,
      };
    }

    try {
      const response = await axios.post(apiUrl, formDataToSend, {
        headers: isRegister
          ? { "Content-Type": "multipart/form-data" }
          : { "Content-Type": "application/json" },
      });
      if (!isRegister) {
        localStorage.setItem("authToken", response.data.token);
      }
      alert(response.data.message);
      navigate("/donor-profile");
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormStep = () => {
    if (!isRegister) {
      return (
        <div className="form-step active">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="e.g., john@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="forgot-password">
            <Link to="/reset-password">Forgot Password?</Link>
          </div>
        </div>
      );
    }

    switch(currentStep) {
      case 1:
        return (
          <div className="form-step active">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="e.g., John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="e.g., john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="form-step active">
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter a secure password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                placeholder="e.g., Chennai, Tamil Nadu"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="form-step active">
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phoneNo"
                placeholder="e.g., 9876543210"
                value={formData.phoneNo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Profile Picture</label>
              <input
                type="file"
                name="profileImage"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Navigation Bar */}
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
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">About Us</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">Contact</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="auth-container">
        <div className="auth-content">
          <div className="auth-header">
            <h1>{isRegister ? "Join as a Donor" : "Welcome Back!"}</h1>
            <p className="auth-subtitle">
              {isRegister 
                ? "Start your journey of making a difference in children's lives" 
                : "Continue your mission of helping others"}
            </p>
          </div>

          {error && <div className="error-message">{error}</div>}

          {isRegister && (
            <div className="step-indicators">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`step-indicator ${
                    step === currentStep ? 'active' : ''
                  } ${step < currentStep ? 'completed' : ''}`}
                >
                  {step}
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {renderFormStep()}

            <div className="step-buttons">
              {isRegister && currentStep > 1 && (
                <button 
                  type="button" 
                  onClick={prevStep}
                  className="btn-modern secondary"
                >
                  <span>←</span>
                  <span>Previous</span>
                </button>
              )}
              {isRegister && currentStep < 3 ? (
                <button 
                  type="button" 
                  onClick={nextStep}
                  className="btn-modern primary"
                >
                  <span>Next</span>
                  <span>→</span>
                </button>
              ) : (
                <button 
                  type="submit" 
                  className={`btn-modern primary ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="button-content">
                      <span className="spinner"></span>
                      <span>{isRegister ? "Registering..." : "Logging in..."}</span>
                    </div>
                  ) : (
                    isRegister ? "Start Donating" : "Login"
                  )}
                </button>
              )}
            </div>

          </form>

          <div className="auth-footer">
            <p>
              {isRegister ? "Already a donor?" : "New to our platform?"}
              <button 
                onClick={() => {
                  setIsRegister(!isRegister);
                  setCurrentStep(1);
                }}
                className="toggle-button"
              >
                {isRegister ? "Login here" : "Register here"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DonorAuth;
