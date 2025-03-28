import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';

// API URLs
const API_URL = 'http://localhost:5000/api/donor/view-request';
const ACCEPT_REQUEST_URL = 'http://localhost:5000/api/donor/accept-request';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled Components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const PageHeader = styled.h1`
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  position: relative;
  padding-bottom: 0.5rem;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #3498db, #2ecc71);
    border-radius: 2px;
  }
`;

const RequestsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const RequestCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
  animation: ${fadeIn} 0.5s ease-out forwards;
  animation-delay: ${props => props.index * 0.1}s;
  opacity: 0;
  border-left: 4px solid ${props => {
    if (props.status === 'active') return '#2ecc71';
    if (props.urgency === 'High') return '#e74c3c';
    if (props.urgency === 'Medium') return '#f39c12';
    return '#3498db';
  }};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }
`;

const OrphanageName = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  color: #7f8c8d;
  font-size: 0.9rem;
  
  &:before {
    content: '📍';
    margin-right: 0.5rem;
  }
`;

const ItemsList = styled.div`
  margin: 1rem 0;
`;

const ItemTag = styled.span`
  display: inline-block;
  background: #f7f9fa;
  padding: 0.3rem 0.8rem;
  border-radius: 30px;
  font-size: 0.8rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  color: #34495e;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.4rem 1rem;
  border-radius: 30px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
  background-color: ${props => {
    if (props.status === 'active') return 'rgba(46, 204, 113, 0.2)';
    return 'rgba(243, 156, 18, 0.2)';
  }};
  color: ${props => {
    if (props.status === 'active') return '#27ae60';
    return '#d35400';
  }};
`;

const UrgencyBadge = styled.span`
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 30px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-left: 0.5rem;
  background-color: ${props => {
    if (props.urgency === 'High') return 'rgba(231, 76, 60, 0.2)';
    if (props.urgency === 'Medium') return 'rgba(243, 156, 18, 0.2)';
    return 'rgba(52, 152, 219, 0.2)';
  }};
  color: ${props => {
    if (props.urgency === 'High') return '#c0392b';
    if (props.urgency === 'Medium') return '#d35400';
    return '#2980b9';
  }};
`;

const AcceptButton = styled.button`
  width: 100%;
  background: linear-gradient(90deg, #3498db, #2ecc71);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 1rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  grid-column: 1 / -1;
  
  h3 {
    color: #7f8c8d;
    margin-bottom: 1rem;
  }
  
  p {
    color: #95a5a6;
  }
`;

const ErrorMessage = styled.div`
  background-color: rgba(231, 76, 60, 0.1);
  color: #c0392b;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
`;

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
        <PageContainer>
            <PageHeader>Requested Donations</PageHeader>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <RequestsGrid>
                {requests.length === 0 ? (
                    <EmptyState>
                        <h3>No Donation Requests</h3>
                        <p>There are currently no donation requests available.</p>
                    </EmptyState>
                ) : (
                    requests.map((request, index) => (
                        <RequestCard 
                            key={index} 
                            index={index} 
                            status={request.status}
                            urgency={request.urgency}
                        >
                            <OrphanageName>{request.name}</OrphanageName>
                            <Location>{request.location}</Location>
                            
                            <div>
                                <StatusBadge status={request.status}>
                                    {request.status.toUpperCase()}
                                </StatusBadge>
                                <UrgencyBadge urgency={request.urgency}>
                                    {request.urgency} URGENCY
                                </UrgencyBadge>
                            </div>
                            
                            <ItemsList>
                                {request.itemsNeeded.map((item, idx) => (
                                    <ItemTag key={idx}>{item}</ItemTag>
                                ))}
                            </ItemsList>
                            
                            {request.status === 'pending' && (
                                <AcceptButton onClick={() => acceptRequest(request.requestId)}>
                                    Accept Request
                                </AcceptButton>
                            )}
                        </RequestCard>
                    ))
                )}
            </RequestsGrid>
        </PageContainer>
    );
};

export default RequestedDonations;
