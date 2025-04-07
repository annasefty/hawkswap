import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../firebase';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../Profile.css';

const Profile = () => {
  const [userListings, setUserListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingListing, setEditingListing] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserListings();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Redirect to home page after logout
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Failed to sign out. Please try again.');
    }
  };

  const fetchUserListings = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setError('Please log in to view your listings');
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, 'items'),
        where('userId', '==', user.uid)
      );

      const querySnapshot = await getDocs(q);
      const listings = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setUserListings(listings);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError('Failed to fetch your listings');
      setLoading(false);
    }
  };

  const handleDelete = async (listing) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      // Delete the image from Storage if it exists
      if (listing.imageUrl) {
        try {
          // Extract the path from the Firebase Storage URL
          const urlPath = decodeURIComponent(listing.imageUrl.split('/o/')[1].split('?')[0]);
          console.log('Extracted storage path:', urlPath);
          
          const imageRef = ref(storage, urlPath);
          console.log('Attempting to delete image at:', imageRef.fullPath);
          
          await deleteObject(imageRef);
          console.log('Image deleted successfully');
        } catch (imageError) {
          console.error('Error deleting image:', imageError);
          // Continue with document deletion even if image deletion fails
        }
      }

      // Delete the document from Firestore
      console.log('Deleting document with ID:', listing.id);
      await deleteDoc(doc(db, 'items', listing.id));
      console.log('Document deleted successfully');

      // Update local state
      setUserListings(prevListings => 
        prevListings.filter(item => item.id !== listing.id)
      );

      setError(''); // Clear any previous errors
    } catch (err) {
      console.error('Error deleting listing:', err);
      setError('Failed to delete listing: ' + err.message);
    }
  };

  const handleEdit = (listing) => {
    setEditingListing({
      ...listing,
      price: listing.price ? listing.price.toFixed(2) : '0.00',
      isEditing: true
    });
  };

  const handlePriceChange = (e) => {
    let value = e.target.value;
    
    // Remove any non-digit characters except decimal point
    value = value.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Limit to two decimal places
    if (parts.length === 2 && parts[1].length > 2) {
      value = parts[0] + '.' + parts[1].slice(0, 2);
    }

    setEditingListing({
      ...editingListing,
      price: value
    });
  };

  const handleUpdate = async () => {
    try {
      // Validate price before updating
      const priceValue = parseFloat(editingListing.price) || 0;
      if (priceValue < 0) {
        setError('Price cannot be negative');
        return;
      }

      const docRef = doc(db, 'items', editingListing.id);
      await updateDoc(docRef, {
        name: editingListing.name,
        description: editingListing.description,
        category: editingListing.category,
        price: priceValue
      });

      // Update local state with properly formatted price
      const updatedListing = {
        ...editingListing,
        price: priceValue
      };

      setUserListings(prevListings =>
        prevListings.map(item =>
          item.id === editingListing.id ? updatedListing : item
        )
      );

      setEditingListing(null);
      setError('');
    } catch (err) {
      console.error('Error updating listing:', err);
      setError('Failed to update listing: ' + err.message);
    }
  };

  if (loading) {
    return <div className="profile-container">Loading...</div>;
  }

  if (!auth.currentUser) {
    navigate('/');
    return null;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="user-info">
          <img 
            src={auth.currentUser.photoURL} 
            alt={auth.currentUser.displayName} 
            className="profile-photo"
          />
          <div className="user-details">
            <h2>{auth.currentUser.displayName}</h2>
            <p>{auth.currentUser.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Log Out
        </button>
      </div>

      <h1>My Listings</h1>
      {error && <div className="error">{error}</div>}
      {userListings.length === 0 ? (
        <p>You haven't listed any items yet.</p>
      ) : (
        <div className="listings-grid">
          {userListings.map(listing => (
            <div key={listing.id} className="listing-card">
              {editingListing?.id === listing.id ? (
                <div className="editing-form">
                  <input
                    type="text"
                    value={editingListing.name}
                    onChange={(e) => setEditingListing({
                      ...editingListing,
                      name: e.target.value
                    })}
                    placeholder="Item Name"
                  />
                  <textarea
                    value={editingListing.description}
                    onChange={(e) => setEditingListing({
                      ...editingListing,
                      description: e.target.value
                    })}
                    placeholder="Description"
                  />
                  <div className="price-input-container">
                    <span className="dollar-sign">$</span>
                    <input
                      type="text"
                      value={editingListing.price}
                      onChange={handlePriceChange}
                      placeholder="0.00"
                      className="price-input"
                    />
                  </div>
                  <select
                    value={editingListing.category}
                    onChange={(e) => setEditingListing({
                      ...editingListing,
                      category: e.target.value
                    })}
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Books">Books</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="edit-buttons">
                    <button onClick={handleUpdate}>Save</button>
                    <button onClick={() => setEditingListing(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <img src={listing.imageUrl} alt={listing.name} />
                  <h3>{listing.name}</h3>
                  <p className="price">${listing.price ? listing.price.toFixed(2) : '0.00'}</p>
                  <p>{listing.description}</p>
                  <p className="category">Category: {listing.category}</p>
                  <p className="status">Status: {listing.status}</p>
                  <div className="action-buttons">
                    <button onClick={() => handleEdit(listing)}>Edit</button>
                    <button onClick={() => handleDelete(listing)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile; 