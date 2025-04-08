import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const PhotoGrid = ({ user, filter, categoryFilter }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'items'));
      const fetchedListings = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setListings(fetchedListings);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  // Fetch listings again when the user logs in
  useEffect(() => {
    if (user) {
      fetchListings();
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div className="no-results">Please log in to view listings.</div>;
  }

  if (listings.length === 0) {
    return <div className="no-results">No listings available.</div>;
  }

  return (
    <div className="photo-grid">
      {listings
        .filter((listing) => {
          const matchesFilter = listing.name.toLowerCase().includes(filter);
          const matchesCategory =
            categoryFilter === 'All' || listing.category === categoryFilter;
          return matchesFilter && matchesCategory;
        })
        .map((listing) => (
          <Link
            to={`/listing/${listing.id}`}
            key={listing.id}
            className="photo-grid-item"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="image-container">
              <img
                src={listing.imageUrl}
                alt={listing.name}
                className="photo-grid-image"
              />
            </div>
            <h3>{listing.name}</h3>
            <p className="item-price">${listing.price.toFixed(2)}</p>
            <p className="item-category">{listing.category}</p>
          </Link>
        ))}
    </div>
  );
};

export default PhotoGrid;