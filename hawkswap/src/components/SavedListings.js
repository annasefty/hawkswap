// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { auth, db } from '../firebase';
// import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
// import '../Profile.css';

// const SavedListings = () => {
//   const [savedItems, setSavedItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchSavedListings = async () => {
//       try {
//         const user = auth.currentUser;
//         if (!user) {
//           setError('Please log in to view your saved listings');
//           setLoading(false);
//           return;
//         }

//         // Get user's saved listings references
//         const savedListingsQuery = query(
//           collection(db, 'savedListings'),
//           where('userId', '==', user.uid)
//         );
//         const savedListingsSnapshot = await getDocs(savedListingsQuery);
        
//         // Fetch full item details for each saved listing
//         const savedItemsPromises = savedListingsSnapshot.docs.map(async (savedDoc) => {
//           const itemDoc = await getDoc(doc(db, 'items', savedDoc.data().itemId));
//           if (itemDoc.exists()) {
//             return {
//               id: itemDoc.id,
//               savedAt: savedDoc.data().savedAt,
//               ...itemDoc.data()
//             };
//           }
//           return null;
//         });

//         const items = (await Promise.all(savedItemsPromises)).filter(item => item !== null);
//         setSavedItems(items);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching saved listings:', err);
//         setError('Failed to fetch saved listings');
//         setLoading(false);
//       }
//     };

//     fetchSavedListings();
//   }, []);

//   const handleListingClick = (id) => {
//     navigate(`/listing/${id}`);
//   };

//   if (loading) {
//     return <div className="saved-listings-container">Loading...</div>;
//   }

//   if (!auth.currentUser) {
//     navigate('/');
//     return null;
//   }

//   return (
//     <div className="saved-listings-container">
//       <h1>Saved Listings</h1>
//       {error && <div className="error">{error}</div>}
//       {savedItems.length === 0 ? (
//         <p>You haven't saved any items yet.</p>
//       ) : (
//         <div className="listings-grid">
//           {savedItems.map((item) => (
//             <div 
//               key={item.id} 
//               className="listing-card"
//               onClick={() => handleListingClick(item.id)}
//             >
//               <img src={item.imageUrl} alt={item.name} />
//               <h3>{item.name}</h3>
//               <p className="item-price">${item.price ? item.price.toFixed(2) : '0.00'}</p>
//               <p>{item.description}</p>
//               <p className="category">Category: {item.category}</p>
//               <p className="saved-date">
//                 Saved on: {new Date(item.savedAt.toDate()).toLocaleDateString()}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SavedListings; 