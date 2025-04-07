import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import '../ListingDetail.css';

const ListingDetail = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchListing = useCallback(async () => {
    if (!id) return;

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
  }, [id]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => { });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchListing();
  }, [fetchListing]);

  if (loading) {
    return (
      <div className="listing-detail-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="listing-detail-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="listing-detail-content">
        <div className="listing-image-container">
          <img
            src={listing.imageUrl}
            alt={listing.name}
            className="listing-detail-image"
            onError={(e) => {
              e.target.src = '/placeholder-image.jpg';
            }}
          />
        </div>

        <div className="listing-info">
          <div className="listing-header">
            <h1>{listing.name}</h1>
          </div>
          <p className="price">${listing.price ? listing.price.toFixed(2) : '0.00'}</p>
          <p className="description">{listing.description}</p>
          <p className="category">Category: {listing.category}</p>
          <p className="status">Status: {listing.status}</p>

          <div className="seller-info">
            <h2>Seller Information</h2>
            <div className="seller-header">
              <h2>{listing.sellerName}</h2>
              <button
                className="gmail-button"
                onClick={() => {
                  const subject = encodeURIComponent('Interested in your Hawk Swap listing');
                  const body = encodeURIComponent(
                    `Hi ${listing.sellerName},\n\nI'm interested in your listing for "${listing.name}". Is it still available?\n\nThanks!`
                  );
                  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${listing.userEmail}&su=${subject}&body=${body}`;
                  window.open(gmailUrl, '_blank');
                }}
              >
                <img
                  src="https://www.gstatic.com/images/branding/product/1x/gmail_2020q4_48dp.png"
                  alt="Gmail logo"
                  className="gmail-icon"
                />
              </button>
            </div>
            {listing.createdAt && (
              <p className="listing-date">
                Listed on: {new Date(listing.createdAt.toDate()).toLocaleDateString()}
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
