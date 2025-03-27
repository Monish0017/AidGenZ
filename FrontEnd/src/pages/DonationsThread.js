import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const DonationsThread = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchDonations = async () => {
      if (!token) {
        setError("Unauthorized. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("https://aidgenz.onrender.com/api/orphanage/available-donations", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setDonations(response.data);
        } else {
          setError("Failed to load donations");
        }
      } catch (err) {
        console.error("Error fetching donations:", err);
        setError("Failed to fetch donations");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [token]);

  const acceptDonation = async (donationId) => {
    try {
      const response = await axios.put(
        `https://aidgenz.onrender.com/api/orphanage/accept-donation/${donationId}`,
        { orphanageId: "your-orphanage-id" }, // Replace with the current orphanage ID
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        alert("Donation accepted successfully, and the donor has been notified!");
        // You can update the UI to reflect the change (e.g., change the status)
      } else {
        setError("Failed to accept donation");
      }
    } catch (err) {
      console.error("Error accepting donation:", err);
      setError("Failed to accept donation");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading donations...</p>;
  if (error) return <p className="text-danger text-center mt-5">{error}</p>;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Available Donations</h2>
      <div className="row">
        {donations.length === 0 ? (
          <p className="text-center">No donations available at the moment.</p>
        ) : (
          donations.map((donation) => (
            <div key={donation._id} className="col-md-4 mb-4">
              <div className="card shadow-sm">
                {donation.imageUrls && donation.imageUrls.length > 0 && (
                  <img
                    src={donation.imageUrls[0]} // Display first image
                    alt={donation.itemName}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{donation.itemName}</h5>
                  <p className="card-text">Category: {donation.category}</p>
                  <p className="card-text">Quantity: {donation.quantity}</p>
                  <Link to={`/donor-profile/${donation.donorId}`} className="btn btn-primary btn-sm">
                    View Donor
                  </Link>
                  <button
                    className="btn btn-success btn-sm ml-2"
                    onClick={() => acceptDonation(donation._id)}
                  >
                    Accept Donation
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DonationsThread;
