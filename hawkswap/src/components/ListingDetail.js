import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import {
  doc,
  getDoc,
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import '../ListingDetail.css';

const ListingDetail = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [savedDocId, setSavedDocId] = useState(null);

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

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto"; // Restore scroll when leaving About page
    };
  }, []);
  useEffect(() => {
    const checkIfSaved = async () => {
      if (!auth.currentUser || !listing) return;

      try {
        const savedRef = collection(db, 'savedListings');
        const snapshot = await getDocs(savedRef);
        const match = snapshot.docs.find(
          (doc) =>
            doc.data().userId === auth.currentUser.uid &&
            doc.data().itemId === listing.id
        );

        if (match) {
          setIsSaved(true);
          setSavedDocId(match.id);
        } else {
          setIsSaved(false);
          setSavedDocId(null);
        }
      } catch (error) {
        console.error('Error checking saved listing:', error);
      }
    };

    checkIfSaved();
  }, [listing]);

  const handleSaveListing = async () => {
    if (!auth.currentUser) {
      alert('Please log in to save this listing.');
      return;
    }

    try {
      const savedListing = {
        userId: auth.currentUser.uid,
        itemId: listing.id,
        savedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'savedListings'), savedListing);
      setIsSaved(true);
      setSavedDocId(docRef.id);
      setSaveMessage('Listing saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving listing:', error);
      alert('Failed to save listing. Please try again.');
    }
  };

  const handleUnsaveListing = async () => {
    if (!auth.currentUser || !savedDocId) return;

    try {
      await deleteDoc(doc(db, 'savedListings', savedDocId));
      setIsSaved(false);
      setSavedDocId(null);
      setSaveMessage('Listing unsaved.');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error unsaving listing:', error);
      alert('Failed to unsave listing. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="listing-detail-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="listing-detail-container">
      <div className="mobile-header-row">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="mobile-actions">
          <button
            className={`save-button ${isSaved ? 'saved' : ''}`}
            onClick={isSaved ? handleUnsaveListing : handleSaveListing}
          >
            {isSaved ? (
              <>
                Unsave<br />Listing
              </>
            ) : (
              <>
                Save<br />Listing
              </>
            )}
          </button>
          <button
            className="report-button"
            onClick={() => {
              const subject = encodeURIComponent(`Report: HawkSwap Listing - ${listing.name}`);
              const body = encodeURIComponent(
                `Hi,\n\nI would like to report the following listing on HawkSwap:\n\n` +
                `Listing Title: ${listing.name}\n` +
                `Seller: ${listing.sellerName}\n` +
                `Price: $${listing.price?.toFixed(2)}\n` +
                `Category: ${listing.category}\n\n` +
                `Reason for reporting:\n[Please describe the issue here]\n\nThank you.`
              );
              const mailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=ans427@lehigh.edu&su=${subject}&body=${body}`;
              window.open(mailUrl, '_blank');
            }}
          >
            Report
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {saveMessage && <div className="success-message">{saveMessage}</div>}

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
            <div className="listing-actions">
              <button
                className={`save-button ${isSaved ? 'saved' : ''}`}
                onClick={isSaved ? handleUnsaveListing : handleSaveListing}
              >
                {isSaved ? (
                  <>
                    Unsave<br />Listing
                  </>
                ) : (
                  <>
                    Save<br />Listing
                  </>
                )}
              </button>

              <button
                className="report-button"
                onClick={() => {
                  const subject = encodeURIComponent(`Report: HawkSwap Listing - ${listing.name}`);
                  const body = encodeURIComponent(
                    `Hi,\n\nI would like to report the following listing on HawkSwap:\n\n` +
                    `Listing Title: ${listing.name}\n` +
                    `Seller: ${listing.sellerName}\n` +
                    `Price: $${listing.price?.toFixed(2)}\n` +
                    `Category: ${listing.category}\n\n` +
                    `Reason for reporting:\n[Please describe the issue here]\n\nThank you.`
                  );
                  const mailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=ans427@lehigh.edu&su=${subject}&body=${body}`;
                  window.open(mailUrl, '_blank');
                }}
              >
                Report Listing
              </button>
            </div>
          </div>

          <p className="price">${listing.price ? listing.price.toFixed(2) : '0.00'}</p>
          <p className="description">{listing.description}</p>
          <p className="category">Category: {listing.category}</p>
          <p className="status">Status: {listing.status}</p>

          <div className="seller-info">
            <div className="seller-info-row">
              <div className="seller-info-text">
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
              <img
                src={listing.sellerPhotoUrl || '/images/default-profile.png'}
                alt={`${listing.sellerName}'s profile`}
                className="seller-profile-pic"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;