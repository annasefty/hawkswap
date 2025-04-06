import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import Popup from './Popup';
import '../Listitem.css';

const ListItem = () => {
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [itemImage, setItemImage] = useState(null);
  const [error, setError] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        console.log('User is authenticated:', currentUser);
        setUser(currentUser);
      } else {
        console.log('No user is authenticated.');
        setUser(null);
      }
    });
  
    return () => unsubscribe();
  }, []);

  const handleImageUpload = async () => {
    if (!itemImage) {
      console.error('No image selected');
      setError('Please select an image to upload.');
      return null;
    }

    try {
      // Create a reference to the user's storage path
      const storageRef = ref(storage, `users/${user.uid}/${Date.now()}_${itemImage.name}`);
      console.log('Uploading to storage path:', storageRef.fullPath);

      // Upload the image
      const snapshot = await uploadBytes(storageRef, itemImage);
      console.log('Image uploaded successfully');

      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Image URL:', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image: ' + error.message);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Starting form submission process...');
      console.log('User ID:', user.uid);
      console.log('Form data:', { itemName, itemDescription, itemCategory });

      // Upload image first
      const imageUrl = await handleImageUpload();
      if (!imageUrl) {
        console.error('Image upload failed');
        setError('Failed to upload image. Please try again.');
        setLoading(false);
        return;
      }

      console.log('Image uploaded successfully, URL:', imageUrl);

      // Create item data
      const itemData = {
        name: itemName,
        description: itemDescription,
        category: itemCategory,
        imageUrl,
        userId: user.uid,
        userEmail: user.email,
        createdAt: new Date(),
        status: 'available'
      };

      console.log('Creating Firestore document with data:', itemData);

      // Add document to Firestore
      const docRef = await addDoc(collection(db, 'items'), itemData);
      console.log('Document created with ID:', docRef.id);

      // Clear form
      setItemName('');
      setItemDescription('');
      setItemCategory('');
      setItemImage(null);
      setError('');
      setPopupMessage('Item listed successfully!');

    } catch (error) {
      console.error('Error in form submission:', error);
      setError(`Failed to list item: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePopupClose = () => {
    setPopupMessage('');
    window.location.reload();
  };

  return (
    <div className="list-item-form">
      <h1>List an Item</h1>
      {error && <p className="error-message">{error}</p>}
      {popupMessage && <Popup message={popupMessage} onClose={handlePopupClose} />}
      {!user ? (
        <p className="error-message">You must be logged in to list an item.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="itemName">Item Name</label>
            <input
              type="text"
              id="itemName"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="itemDescription">Item Description</label>
            <textarea
              id="itemDescription"
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="itemCategory">Category</label>
            <select
              id="itemCategory"
              value={itemCategory}
              onChange={(e) => setItemCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="itemImage">Upload Image</label>
            <input
              type="file"
              id="itemImage"
              accept="image/*"
              onChange={(e) => setItemImage(e.target.files[0])}
              required
            />

          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ListItem;