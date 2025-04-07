import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore'; // Removed unused imports related to saving
import { onAuthStateChanged } from 'firebase/auth';
import '../ListingDetail.css';

const ListingDetail = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // const [isSaved, setIsSaved] = useState(false);
  // const [currentUser, setCurrentUser] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch listing data
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

  // // Check saved status
  // const checkSavedStatus = useCallback(async (userId) => {
  //   if (!userId || !id) return;
    
  //   try {
  //     const savedQuery = query(
  //       collection(db, 'items'),
  //       where('userId', '==', userId),
  //       where('itemId', '==', id)
  //     );
  //     const savedSnap = await getDocs(savedQuery);
  //     setIsSaved(!savedSnap.empty);
  //   } catch (err) {
  //     console.error('Error checking saved status:', err);
  //   }
  // }, [id]);

  // Handle auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // setCurrentUser(user);
      // if (user) {
      //   checkSavedStatus(user.uid);
      // }
    });

    return () => unsubscribe();
  }, []);

  // Fetch listing when component mounts
  useEffect(() => {
    fetchListing();
  }, [fetchListing]);

  // const handleSaveToggle = async () => {
  //   if (!currentUser) {
  //     setError('You must be signed in to save items');
  //     return;
  //   }

  //   try {
  //     setError('');
  //     console.log('Current user:', {
  //       uid: currentUser.uid,
  //       email: currentUser.email,
  //       isAnonymous: currentUser.isAnonymous
  //     });

  //     const savedItemsRef = collection(db, 'items');
      
  //     const savedQuery = query(
  //       savedItemsRef,
  //       where('userId', '==', currentUser.uid),
  //       where('itemId', '==', id)
  //     );

  //     const savedSnap = await getDocs(savedQuery);
      
  //     if (savedSnap.empty) {
  //       const savedData = {
  //         userId: currentUser.uid,
  //         itemId: id,
  //         savedAt: new Date(),
  //         itemName: listing?.name || '',
  //         itemPrice: listing?.price || 0,
  //         imageUrl: listing?.imageUrl || '',
  //         category: listing?.category || '',
  //         description: listing?.description || ''
  //       };
        
  //       const docRef = await addDoc(collection(db, 'items'), savedData);
  //       setIsSaved(true);
  //       setError('');
  //     } else {
  //       const docToDelete = savedSnap.docs[0];
  //       await deleteDoc(doc(db, 'items', docToDelete.id));
  //       setIsSaved(false);
  //       setError('');
  //     }
  //   } catch (err) {
  //     console.error('Operation failed:', err);
  //     if (err.code === 'permission-denied') {
  //       setError('Permission denied - please try signing out and back in');
  //     } else {
  //       setError(`Failed to save: ${err.message}`);
  //     }
  //   }
  // };

  if (loading) {
    return (
      <div className="listing-detail-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="listing-detail-container error">
        <p>{error || 'Listing not found'}</p>
        <button className="back-button" onClick={() => navigate('/')}>Back to Home</button>
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
            {/* 
            {currentUser && (
              <button 
                className={`save-button ${isSaved ? 'saved' : ''}`}
                onClick={handleSaveToggle}
              >
                {isSaved ? 'Saved ★' : 'Save ☆'}
              </button>
            )}
            */}
          </div>
          <p className="price">${listing.price ? listing.price.toFixed(2) : '0.00'}</p>
          <p className="description">{listing.description}</p>
          <p className="category">Category: {listing.category}</p>
          <p className="status">Status: {listing.status}</p>
          
          <div className="seller-info">
            <h2>Seller Information</h2>
            <p className="seller-email">Contact: {listing.userEmail}</p>
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
