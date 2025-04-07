import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import {
  ref,
  deleteObject,
  // uploadBytes,
  // getDownloadURL
} from 'firebase/storage';
import {
  signOut,
  // updateProfile
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../Profile.css';

const Profile = () => {
  const [userListings, setUserListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingListing, setEditingListing] = useState(null);
  // const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserListings();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
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

      const q = query(collection(db, 'items'), where('userId', '==', user.uid));
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

  // const handleProfilePicUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   setUploading(true);
  //   try {
  //     const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}`);
  //     await uploadBytes(storageRef, file);
  //     const photoURL = await getDownloadURL(storageRef);

  //     await updateProfile(auth.currentUser, { photoURL });
  //     await updateDoc(doc(db, 'users', auth.currentUser.uid), { photoURL });

  //     window.location.reload(); // or update state for smoother UX
  //   } catch (error) {
  //     console.error('Failed to upload profile picture:', error);
  //     setError('Failed to update profile picture');
  //   }
  //   setUploading(false);
  // };

  const handleDelete = async (listing) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;

    try {
      if (listing.imageUrl) {
        try {
          const urlPath = decodeURIComponent(listing.imageUrl.split('/o/')[1].split('?')[0]);
          const imageRef = ref(storage, urlPath);
          await deleteObject(imageRef);
        } catch (imageError) {
          console.error('Error deleting image:', imageError);
        }
      }

      await deleteDoc(doc(db, 'items', listing.id));
      setUserListings(prev => prev.filter(item => item.id !== listing.id));
      setError('');
    } catch (err) {
      console.error('Error deleting listing:', err);
      setError('Failed to delete listing: ' + err.message);
    }
  };

  const handleEdit = (listing) => {
    setEditingListing({
      ...listing,
      price: listing.price ? listing.price.toFixed(2) : '0.00',
      isEditing: true,
    });
  };

  const handlePriceChange = (e) => {
    let value = e.target.value.replace(/[^\d.]/g, '');
    const parts = value.split('.');
    if (parts.length > 2) value = parts[0] + '.' + parts.slice(1).join('');
    if (parts.length === 2 && parts[1].length > 2) {
      value = parts[0] + '.' + parts[1].slice(0, 2);
    }
    setEditingListing({ ...editingListing, price: value });
  };

  const handleUpdate = async () => {
    try {
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
        price: priceValue,
      });

      const updatedListing = { ...editingListing, price: priceValue };
      setUserListings(prev =>
        prev.map(item => (item.id === editingListing.id ? updatedListing : item))
      );

      setEditingListing(null);
      setError('');
    } catch (err) {
      console.error('Error updating listing:', err);
      setError('Failed to update listing: ' + err.message);
    }
  };

  if (loading) return <div className="profile-container">Loading...</div>;
  if (!auth.currentUser) {
    navigate('/');
    return null;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="user-info">
          <img
            src={auth.currentUser.photoURL || '/default-avatar.png'}
            alt={auth.currentUser.displayName}
            className="profile-photo"
          />
          <div className="user-details">
            <h2>{auth.currentUser.displayName}</h2>
            <p>{auth.currentUser.email}</p>

            {/* Profile photo upload UI (currently disabled) */}
            {/* <div className="profile-photo-upload">
              <label htmlFor="photoUpload">Change Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                id="photoUpload"
                onChange={handleProfilePicUpload}
                disabled={uploading}
              />
            </div> */}
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
                    onChange={(e) =>
                      setEditingListing({ ...editingListing, name: e.target.value })
                    }
                    placeholder="Item Name"
                  />
                  <textarea
                    value={editingListing.description}
                    onChange={(e) =>
                      setEditingListing({ ...editingListing, description: e.target.value })
                    }
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
                    onChange={(e) =>
                      setEditingListing({ ...editingListing, category: e.target.value })
                    }
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
                  <p className="price">
                    ${listing.price ? listing.price.toFixed(2) : '0.00'}
                  </p>
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
