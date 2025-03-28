import { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './DonorList.css';

const DonorList = () => {
  const [donationData, setDonationData] = useState({
    itemName: '',
    quantity: '',
    category: '',
    itemImages: [],
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle form input changes
  const handleDonationChange = (e) => {
    const { name, value } = e.target;
    setDonationData({
      ...donationData,
      [name]: value,
    });
  };

  // Handle file selection for multiple images
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setDonationData((prevData) => ({
      ...prevData,
      itemImages: [...prevData.itemImages, ...selectedFiles],
    }));
  };

  // Remove selected image from list
  const removeImage = (index) => {
    setDonationData((prevData) => ({
      ...prevData,
      itemImages: prevData.itemImages.filter((_, i) => i !== index),
    }));
  };

  // Submit donation form
  const handleDonationSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('No authentication token found.');
        return;
      }

      const decodedToken = jwtDecode(token);
      const donorId = decodedToken.donorId;

      const formData = new FormData();
      formData.append('donorId', donorId);
      formData.append('itemName', donationData.itemName);
      formData.append('quantity', donationData.quantity);
      formData.append('category', donationData.category);
      
      donationData.itemImages.forEach((image) => {
        formData.append('itemImages', image);
      });

      await axios.post('http://localhost:5000/api/donor/add-donation', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess('Donation added successfully');
      setDonationData({
        itemName: '',
        quantity: '',
        category: '',
        itemImages: [],
      });
    } catch (err) {
      setError('Error adding donation');
      console.error('Donation error:', err);
    }
  };

  return (
    <div className="donation-container">
      <div className="donation-header">
        <h2>Add a Donation</h2>
        <p>Share your items with those in need and make a difference today</p>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <form onSubmit={handleDonationSubmit} className="donation-form">
        <div className="form-group">
          <label htmlFor="itemName" className="form-label">Item Name</label>
          <input
            type="text"
            className="form-control"
            id="itemName"
            name="itemName"
            value={donationData.itemName}
            onChange={handleDonationChange}
            placeholder="Enter the name of the item"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="quantity" className="form-label">Quantity</label>
          <input
            type="number"
            className="form-control"
            id="quantity"
            name="quantity"
            value={donationData.quantity}
            onChange={handleDonationChange}
            placeholder="How many items are you donating?"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category" className="form-label">Category</label>
          <select
            className="form-control"
            id="category"
            name="category"
            value={donationData.category}
            onChange={handleDonationChange}
            required
          >
            <option value="">Select a category</option>
            <option value="Clothing">Clothing</option>
            <option value="Food">Food</option>
            <option value="Books">Books</option>
            <option value="Toys">Toys</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="itemImages" className="form-label">Item Images</label>
          <div className="file-upload-container">
            <label className="file-upload-label">
              <div className="file-upload-icon">📸</div>
              <div className="file-upload-text">Drag & drop images here or click to browse</div>
              <div className="file-upload-subtext">Upload high-quality images of your donation items</div>
              <input
                type="file"
                className="file-input"
                id="itemImages"
                name="itemImages"
                multiple
                onChange={handleFileChange}
                required
              />
            </label>
          </div>
        </div>
        
        {donationData.itemImages.length > 0 && (
          <div className="image-preview-container">
            <h5 className="image-preview-title">Selected Images</h5>
            <div className="image-preview-grid">
              {donationData.itemImages.map((image, index) => (
                <div key={index} className="image-preview-item">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Selected ${index + 1}`}
                    className="preview-image"
                  />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() => removeImage(index)}
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <button type="submit" className="submit-btn">
          Add Donation
        </button>
      </form>
    </div>
  );
};

export default DonorList;
