import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
        const response = await axios.get("https://aidgenz.onrender.com/api/donor/profile", {
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
      const response = await axios.delete(`https://aidgenz.onrender.com/api/donations/delete-donation/${donationId}`, {
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
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-danger mt-5">{error}</div>;
  }

  if (!donor) {
    return <div className="text-center mt-5">No donor data available.</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center">Donor Profile</h2>
      <div className="row mt-4">
        <div className="col-md-4 text-center">
          <img
            src={donor.donor.profileImage || "/default-profile-image.png"}
            alt="Profile"
            className="img-fluid rounded-circle border shadow"
            style={{ width: "200px", height: "200px", objectFit: "cover" }}
          />
        </div>
        <div className="col-md-8">
          <div className="card shadow-sm p-3">
            <h4>{donor.donor.name}</h4>
            <p><strong>Email:</strong> {donor.donor.email}</p>
            <p><strong>Location:</strong> {donor.donor.location || "Not provided"}</p>
            <p><strong>Phone:</strong> {donor.donor.phoneNo || "Not provided"}</p>
            <p><strong>Credits:</strong> {donor.donor.points || 0}</p>
          </div>

          {/* Recent Donations */}
          <div className="mt-4">
            <h5>Recent Donations:</h5>
            {donor.donations && donor.donations.length > 0 ? (
              <ul className="list-group">
                {donor.donations.map((donation, index) => (
                  <li key={index} className="list-group-item">
                    {donation.itemName} - {donation.quantity}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No recent donations.</p>
            )}
          </div>

          {/* Accepted Requests */}
          <hr />
          <div className="mt-4">
            <h5>Accepted Donation Requests:</h5>
            {donor.acceptedRequests && donor.acceptedRequests.length > 0 ? (
              <ul className="list-group">
                {donor.acceptedRequests.map((request, index) => (
                  <li key={index} className="list-group-item">
                    <strong>Phone:</strong> {request.phoneNo}
                    <br />
                    <strong>Orphanage:</strong> {request.name}
                    <br />
                    <strong>Items Needed:</strong> {Array.isArray(request.itemsNeeded) ? request.itemsNeeded.join(", ") : "No items listed"}
                    <br />
                    <strong>Urgency:</strong> {request.urgency}
                    <br />
                    <strong>Status:</strong> {request.status}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No accepted requests.</p>
            )}
          </div>
          
          {/* All Donations */}
          <hr />
          <div className="mt-4">
            <h5>All Donations:</h5>
            {donor.donations && donor.donations.length > 0 ? (
              <div className="row">
                {donor.donations.map((donation) => (
                  <div key={donation._id} className="col-md-4 mb-4">
                    <div className="card shadow-sm">
                      {donation.imageUrls && donation.imageUrls.length > 0 && (
                        <img
                          src={donation.imageUrls[0]}
                          alt={donation.itemName}
                          className="card-img-top"
                          style={{ height: "200px", objectFit: "cover" }}
                        />
                      )}
                      <div className="card-body">
                        <h5 className="card-title">{donation.itemName}</h5>
                        <p className="card-text">Category: {donation.category}</p>
                        <p className="card-text">Quantity: {donation.quantity}</p>
                        <p className="card-text">Status: {donation.status}</p>
                        <button
                          className="btn btn-danger w-100 mt-2"
                          onClick={() => handleDeleteDonation(donation._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No donations found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDonor;
