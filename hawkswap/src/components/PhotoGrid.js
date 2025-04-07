import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { auth } from '../firebase';
import '../App.css';

const PhotoGrid = ({ filter }) => {
  const [items, setItems] = useState([]);
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

  // Filter items based on search input
  const filteredItems = items.filter(item => {
    if (!filter) return true;
    
    const searchTerm = filter.toLowerCase();
    return (
      item.name?.toLowerCase().includes(searchTerm) ||
      item.description?.toLowerCase().includes(searchTerm) ||
      item.category?.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <>
      {showLoginPopup && (
        <div className="login-popup">
          <p>Please sign in to view listing details</p>
        </div>
      )}
      <div className="photo-grid">
        {filteredItems.length === 0 ? (
          <div className="no-results">
            <p>No items found matching your search.</p>
          </div>
        ) : (
          filteredItems.map((item) => (
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
              <p className="item-price">${item.price ? item.price.toFixed(2) : '0.00'}</p>
              <p className="item-description">{item.description}</p>
              <p className="item-category"><strong>Category:</strong> {item.category}</p>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default PhotoGrid;