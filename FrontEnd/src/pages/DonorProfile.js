import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const ProfileDonor = () => {
  const { donorId } = useParams();
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchDonorProfile = async () => {
      try {
        const response = await axios.get(
          `https://aidgenz.onrender.com/api/orphanage/${donorId}`, // ✅ Corrected API endpoint
          { headers: { Authorization: `Bearer ${token}` } }
        );

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
  }, [donorId, token]); // ✅ Include donorId in the dependency array

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center text-danger mt-5">{error}</div>;
  if (!donor) return <div className="text-center mt-5">No donor data available.</div>;

  return (
    <div className="container mt-5">
      <h2 className="text-center">Donor Profile</h2>
      <div className="row mt-4">
        <div className="col-md-4 text-center">
          <img
            src={donor.profileImage || "/default-profile-image.png"}
            alt="Profile"
            className="img-fluid rounded-circle border shadow"
            style={{ width: "200px", height: "200px", objectFit: "cover" }}
          />
        </div>
        <div className="col-md-8">
          <div className="card shadow-sm p-3">
            <h4>{donor.name}</h4>
            <p><strong>Location:</strong> {donor.location || "Not provided"}</p>
            <p><strong>Credits:</strong> {donor.points || 0}</p>
          </div>

          {/* All Donations */}
          <div className="mt-4">
            <h5>All Donations:</h5>
            {donor.donations && donor.donations.length > 0 ? (
              <div className="row">
                {donor.donations.map((donation) => (
                  <div key={donation._id} className="col-md-4 mb-4">
                    <div className="card shadow-sm">
                      {donation.imageUrls?.length > 0 && (
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

                        {/* ✅ Fix Conditional Rendering */}
                        {donation.rating && (
                          <p className="card-text"><strong>Rating:</strong> {donation.rating}</p>
                        )}
                        {donation.comment && (
                          <p className="card-text"><strong>Comment:</strong> {donation.comment}</p>
                        )}
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
