import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import '../App.css';

const PhotoGrid = ({ filter, categoryFilter }) => {
  const [items, setItems] = useState([]);
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
    navigate(`/listing/${id}`);
  };

  // Filter items based on search input and category
  const filteredItems = items.filter(item => {
    const matchesSearch = !filter || 
      item.name?.toLowerCase().includes(filter.toLowerCase()) ||
      item.description?.toLowerCase().includes(filter.toLowerCase());

    const matchesCategory = !categoryFilter || categoryFilter === 'All' || 
      item.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="photo-grid">
      {filteredItems.length === 0 ? (
        <div className="no-results">
          <p>Please log in to view listings.</p>
        </div>
      ) : (
        filteredItems.map((item) => (
          <div 
            key={item.id} 
            className="photo-grid-item"
            onClick={() => handleListingClick(item.id)}
          >
            <div className="image-container">
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.name} className="photo-grid-image" />
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
  );
};

export default PhotoGrid;