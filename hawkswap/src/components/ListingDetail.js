import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import '../ListingDetail.css';

const ListingDetail = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const docRef = doc(db, 'items', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setListing({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Listing not found');
        }
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError('Failed to load listing');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (loading) {
    return <div className="listing-detail-container">Loading...</div>;
  }

  if (error || !listing) {
    return (
      <div className="listing-detail-container error">
        <p>{error || 'Listing not found'}</p>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="listing-detail-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>
      
      <div className="listing-detail-content">
        <div className="listing-image-container">
          <img 
            src={listing.imageUrl} 
            alt={listing.name} 
            className="listing-detail-image"
          />
        </div>

        <div className="listing-info">
          <h1>{listing.name}</h1>
          <p className="description">{listing.description}</p>
          <p className="category">Category: {listing.category}</p>
          <p className="status">Status: {listing.status}</p>
          
          <div className="seller-info">
            <h2>Seller Information</h2>
            <p className="seller-email">Contact: {listing.userEmail}</p>
            <p className="listing-date">
              Listed on: {new Date(listing.createdAt.toDate()).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail; 