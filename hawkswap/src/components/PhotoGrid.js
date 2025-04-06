import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { auth } from '../firebase';
import '../App.css';

const PhotoGrid = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const navigate = useNavigate();
  const db = getFirestore();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'items'));
        const itemsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setItems(itemsData);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError('Failed to fetch items. Please check your permissions.');
      }
    };
  
    fetchItems();
  }, [db]);

  const handleListingClick = (id) => {
    if (!auth.currentUser) {
      setShowLoginPopup(true);
      setTimeout(() => {
        setShowLoginPopup(false);
      }, 3000);
      return;
    }
    navigate(`/listing/${id}`);
  };

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <>
      {showLoginPopup && (
        <div className="login-popup">
          <p>Please sign in to view listing details</p>
        </div>
      )}
      <div className="photo-grid">
        {items.map((item) => (
          <div 
            key={item.id} 
            className={`photo-grid-item ${!auth.currentUser ? 'not-logged-in' : ''}`}
            onClick={() => handleListingClick(item.id)}
          >
            <div className="image-container">
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.name} className="photo-grid-image" />
              )}
              {!auth.currentUser && (
                <div className="login-overlay">
                  <span>Sign in to view details</span>
                </div>
              )}
            </div>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p><strong>Category:</strong> {item.category}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default PhotoGrid;