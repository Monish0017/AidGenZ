import { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

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

      await axios.post('https://aidgenz.onrender.com/api/donor/add-donation', formData, {
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
    <div className="container mt-5">
      <h2 className="text-center">Add a Donation</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleDonationSubmit}>
        <div className="mb-3">
          <label htmlFor="itemName" className="form-label">Item Name</label>
          <input
            type="text"
            className="form-control"
            id="itemName"
            name="itemName"
            value={donationData.itemName}
            onChange={handleDonationChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="quantity" className="form-label">Quantity</label>
          <input
            type="number"
            className="form-control"
            id="quantity"
            name="quantity"
            value={donationData.quantity}
            onChange={handleDonationChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">Category</label>
          <input
            type="text"
            className="form-control"
            id="category"
            name="category"
            value={donationData.category}
            onChange={handleDonationChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="itemImages" className="form-label">Item Images</label>
          <input
            type="file"
            className="form-control"
            id="itemImages"
            name="itemImages"
            multiple
            onChange={handleFileChange}
            required
          />
        </div>
        {donationData.itemImages.length > 0 && (
          <div className="mb-3">
            <h5>Selected Images:</h5>
            <div className="d-flex flex-wrap">
              {donationData.itemImages.map((image, index) => (
                <div key={index} className="position-relative m-2">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Selected ${index}`}
                    className="img-thumbnail"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                  <button
                    type="button"
                    className="btn btn-danger btn-sm position-absolute top-0 end-0"
                    onClick={() => removeImage(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <button type="submit" className="btn btn-primary">Add Donation</button>
      </form>
    </div>
  );
};

export default DonorList;
