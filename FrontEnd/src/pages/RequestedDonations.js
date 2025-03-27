import React, { useState, useEffect } from 'react';
import axios from 'axios';

// API URLs
const API_URL = 'https://aidgenz.onrender.com/api/donor/view-request';
const ACCEPT_REQUEST_URL = 'https://aidgenz.onrender.com/api/donor/accept-request';

const RequestedDonations = () => {
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get(API_URL, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });
                console.log(response.data); // Corrected this line to access response data
                setRequests(response.data); // This should now work correctly
            } catch (err) {
                setError('Failed to fetch donation requests');
            }
        };

        fetchRequests();
    }, []);

    // Function to handle request acceptance
    const acceptRequest = async (requestId) => {
        try {
            console.log(requestId);
            await axios.patch(
                `${ACCEPT_REQUEST_URL}/${requestId}`,
                {}, // No request body needed
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    },
                }
            );

            // Update UI after successful acceptance
            setRequests((prevRequests) =>
                prevRequests.map((request) =>
                    request._id === requestId ? { ...request, status: 'active' } : request
                )
            );
        } catch (error) {
            console.error('Error accepting request:', error);
            setError('Failed to accept request.');
        }
    };

    return (
        <div className="container">
            <h2 className="mt-4">Requested Donations Log</h2>
            {error && <p className="text-danger">{error}</p>}
            <ul className="list-group">
                {requests.length === 0 ? (
                    <p>No requests available.</p>
                ) : (
                    requests.map((request, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <h5>Orphanage: {request.name}</h5>
                                <h6>Location: {request.location}</h6>
                                <p>Items Needed: {request.itemsNeeded.join(', ')}</p>
                                <p>Urgency: {request.urgency}</p>
                                <p>Status: <strong className={request.status === 'active' ? 'text-success' : 'text-warning'}>{request.status}</strong></p>
                            </div>
                            {request.status === 'pending' && (
                                <button className="btn btn-primary" onClick={() => acceptRequest(request.requestId)}>
                                    Accept
                                </button>
                            )}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default RequestedDonations;
