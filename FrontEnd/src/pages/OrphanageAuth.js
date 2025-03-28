import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../CSS/Auth.css";  // Update this line

const OrphanageAuth = () => {
  const [isRegister, setIsRegister] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    phoneNo: "",
    description: "",
    requirements: "",
    documents: null,
    profileImage: null
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const apiUrl = isRegister 
      ? "https://aidgenz.onrender.com/api/orphanage/register" 
      : "https://aidgenz.onrender.com/api/orphanage/login";
    
    let formDataToSend;

    if (isRegister) {
      formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key !== "profileImage" && key !== "documents") {
          formDataToSend.append(key, formData[key]);
        }
      });
      const images = [formData.profileImage, formData.documents];
      images.forEach((image, index) => {
        if (image) {
          formDataToSend.append("images", image);
        }
      });
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
      navigate("/orphanage-profile");
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const getStepTitle = (step) => {
    switch(step) {
      case 1: return "Basic Information";
      case 2: return "Contact Details";
      case 3: return "Organization Details";
      case 4: return "Documentation";
      default: return "";
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
              placeholder="orphanage@example.com"
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
              <label>Orphanage Name</label>
              <input
                type="text"
                name="name"
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
                value={formData.password}
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
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phoneNo"
                value={formData.phoneNo}
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
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us about your orphanage..."
                required
              />
            </div>
            <div className="form-group">
              <label>Requirements</label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="List your current needs..."
                required
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="form-step active">
            <div className="form-group">
              <label>Legal Documents</label>
              <input
                type="file"
                name="documents"
                onChange={handleFileChange}
                accept=".pdf"
                required
              />
              <small>Upload registration certificate or legal documents</small>
            </div>
            <div className="form-group">
              <label>Profile Image</label>
              <input
                type="file"
                name="profileImage"
                onChange={handleFileChange}
                accept="image/*"
              />
              <small>Upload a photo of your orphanage</small>
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
            <h1>{isRegister ? "Register Your Orphanage" : "Welcome Back!"}</h1>
            <p className="auth-subtitle">
              {isRegister 
                ? "Join our platform to connect with donors and make a difference" 
                : "Login to manage your orphanage profile and donations"}
            </p>
          </div>

          {error && <div className="error-message">{error}</div>}

          {isRegister && (
            <>
              <div className="step-indicators">
                {[1, 2, 3, 4].map((step) => (
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
              <div className="step-progress">
                <h3 className="step-title">{getStepTitle(currentStep)}</h3>
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {renderFormStep()}

            <div className="step-buttons">
              {isRegister && currentStep > 1 && (
                <button 
                  type="button" 
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="step-button prev"
                >
                  ← Previous
                </button>
              )}
              
              {isRegister && currentStep < 4 ? (
                <button 
                  type="button" 
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="step-button next"
                >
                  Next →
                </button>
              ) : (
                <button 
                  type="submit"
                  className={`step-button next ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="button-content">
                      <span className="spinner"></span>
                      <span>{isRegister ? "Registering..." : "Logging in..."}</span>
                    </div>
                  ) : (
                    isRegister ? "Complete Registration" : "Login"
                  )}
                </button>
              )}
            </div>
          </form>

          <div className="auth-footer">
            <p>
              {isRegister ? "Already registered?" : "New to our platform?"}
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

export default OrphanageAuth;
