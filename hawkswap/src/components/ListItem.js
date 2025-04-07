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
  const [itemPrice, setItemPrice] = useState('');
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
      setError('Please select an image to upload.');
      return null;
    }

    try {
      // Check if image is HEIC format
      if (itemImage.name.toLowerCase().endsWith('.heic')) {
        setError('HEIC images are not supported. Please convert to JPEG/PNG before uploading.');
        return null;
      }

      const timestamp = Date.now();
      const extension = itemImage.name.split('.').pop().toLowerCase();
      
      // Only allow certain image formats
      const allowedFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
      if (!allowedFormats.includes(extension)) {
        setError('Please upload an image in JPG, PNG, GIF, or WebP format.');
        return null;
      }

      const filePath = `users/${user.uid}/${timestamp}_${itemImage.name}`;
      const storageRef = ref(storage, filePath);
      
      // Add metadata
      const metadata = {
        contentType: `image/${extension === 'jpg' ? 'jpeg' : extension}`,
        customMetadata: {
          uploadedBy: user.email,
          uploadTime: new Date().toISOString()
        }
      };

      const snapshot = await uploadBytes(storageRef, itemImage, metadata);
      console.log('Image uploaded successfully:', snapshot.ref.fullPath);
      
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload image. Please try again.');
      return null;
    }
  };

  const validatePrice = (price) => {
    const priceFloat = parseFloat(price);
    return !isNaN(priceFloat) && priceFloat >= 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate price
    if (!validatePrice(itemPrice)) {
      setError('Please enter a valid price (must be a positive number)');
      setLoading(false);
      return;
    }

    try {
      console.log('Starting form submission process...');
      console.log('User ID:', user.uid);
      console.log('Form data:', { itemName, itemDescription, itemCategory, itemPrice });

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
        price: parseFloat(itemPrice), // Store as number
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
      setItemPrice('');
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
            <label htmlFor="itemPrice">Price ($)</label>
            <input
              type="number"
              id="itemPrice"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
              min="0"
              step="0.01"
              placeholder="0.00"
              required
            />
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